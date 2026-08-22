/**
 * Asynchronous Background Job System
 * 
 * Provides:
 * 1. Non-blocking task dispatch from HTTP handlers
 * 2. Idempotency guarantees to prevent duplicate processing
 * 3. Batch chunking (50-100 items per batch) to avoid memory overload
 * 4. Automatic retry on transient failures
 * 5. Cache invalidation hooks upon completion
 */

import { connectDB } from '@/lib/db';
import { JobQueue, JobType } from '@/models/JobQueue';
import { UserNotification } from '@/models/UserNotification';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { cache } from '@/lib/cache';

export interface DispatchOptions {
  idempotencyKey?: string;
  maxRetries?: number;
}

/**
 * Dispatch an asynchronous background task.
 * Returns immediately with the job ID so the HTTP request completes fast.
 */
export async function dispatchJob(
  type: JobType,
  payload: Record<string, any>,
  options: DispatchOptions = {}
): Promise<string> {
  await connectDB();

  // Check idempotency if key provided
  if (options.idempotencyKey) {
    const existing = await JobQueue.findOne({ idempotencyKey: options.idempotencyKey }).lean();
    if (existing) {
      if (existing.status === 'COMPLETED' || existing.status === 'PROCESSING') {
        return (existing._id as any).toString();
      }
    }
  }

  const job = await JobQueue.create({
    type,
    payload,
    idempotencyKey: options.idempotencyKey,
    maxRetries: options.maxRetries ?? 3,
    status: 'PENDING',
  });

  const jobId = (job._id as any).toString();

  // Execute asynchronously in background without awaiting in the HTTP thread
  if (typeof setImmediate !== 'undefined') {
    setImmediate(() => {
      processJob(jobId).catch((err) => console.error(`[BackgroundJob] Error executing job ${jobId}:`, err));
    });
  } else {
    setTimeout(() => {
      processJob(jobId).catch((err) => console.error(`[BackgroundJob] Error executing job ${jobId}:`, err));
    }, 0);
  }

  return jobId;
}

/**
 * Executes a specific background job by ID with batching and error tracking.
 */
export async function processJob(jobId: string): Promise<void> {
  await connectDB();

  const job = await JobQueue.findById(jobId);
  if (!job || job.status === 'COMPLETED') return;

  job.status = 'PROCESSING';
  job.startedAt = new Date();
  await job.save();

  try {
    switch (job.type) {
      case 'ANNOUNCEMENT_DELIVERY': {
        const { announcementId, targetAudience, targetPartnerId, title, body } = job.payload;

        // Invalidate public and user caches so announcement is live immediately
        cache.invalidateAnnouncements();

        // If targeted to specific partners or customers, create notifications in batches of 50
        let userQuery: any = {};
        if (targetAudience === 'CUSTOMER') userQuery.role = 'CUSTOMER';
        else if (targetAudience === 'PARTNER') {
          userQuery.role = { $in: ['PARTNER_ADMIN', 'PARTNER_STAFF'] };
          if (targetPartnerId) userQuery.partnerId = targetPartnerId;
        }

        const targetUsers = await User.find(userQuery).select('_id').lean();
        const total = targetUsers.length;
        job.totalCount = total;

        const CHUNK_SIZE = 50;
        let processed = 0;

        for (let i = 0; i < targetUsers.length; i += CHUNK_SIZE) {
          const chunk = targetUsers.slice(i, i + CHUNK_SIZE);
          const notifs = chunk.map((u) => ({
            userId: (u._id as any).toString(),
            type: 'GENERAL',
            title,
            body,
            relatedId: announcementId,
            relatedType: 'ANNOUNCEMENT',
            isRead: false,
          }));

          await UserNotification.insertMany(notifs, { ordered: false }).catch(() => {});
          processed += chunk.length;
          job.processedCount = processed;
        }

        cache.invalidate('notifications');
        break;
      }

      case 'NOTIFICATION_BATCH': {
        const { notifications } = job.payload;
        if (Array.isArray(notifications) && notifications.length > 0) {
          job.totalCount = notifications.length;
          const CHUNK_SIZE = 50;
          let processed = 0;

          for (let i = 0; i < notifications.length; i += CHUNK_SIZE) {
            const chunk = notifications.slice(i, i + CHUNK_SIZE);
            await UserNotification.insertMany(chunk, { ordered: false }).catch(() => {});
            processed += chunk.length;
            job.processedCount = processed;
          }

          cache.invalidate('notifications');
        }
        break;
      }

      case 'ANALYTICS_AGGREGATION': {
        // Compute precalculated analytics summary and cache for 5 minutes
        const [totalOrders, completedOrders, pendingOrders] = await Promise.all([
          Order.countDocuments(),
          Order.countDocuments({ orderStatus: 'COMPLETED' }),
          Order.countDocuments({ orderStatus: { $in: ['PENDING', 'PROCESSING'] } }),
        ]);

        const revenueAgg = await Order.aggregate([
          { $match: { paymentStatus: 'PAID' } },
          { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
        ]);

        const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

        const summary = {
          totalOrders,
          completedOrders,
          pendingOrders,
          totalRevenue,
          lastAggregatedAt: new Date().toISOString(),
        };

        // Store precalculated summary in cache
        cache.set('admin:analytics:summary', summary, 300);
        break;
      }

      default:
        break;
    }

    job.status = 'COMPLETED';
    job.completedAt = new Date();
    job.error = null;
    await job.save();
  } catch (error: any) {
    job.retryCount += 1;
    job.error = error?.message || 'Unknown processing error';

    if (job.retryCount >= job.maxRetries) {
      job.status = 'FAILED';
    } else {
      job.status = 'PENDING'; // Can be retried
    }

    await job.save();
    throw error;
  }
}
