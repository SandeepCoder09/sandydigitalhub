/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order: any, user: any) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(255, 122, 0); // #FF4500
  doc.text('Sandy Digital Hub', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Invoice for Digital Services', 14, 28);
  
  // Invoice Info
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Invoice Number: INV-${order._id.toString().slice(-8).toUpperCase()}`, 14, 45);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 52);
  doc.text(`Payment Status: ${order.paymentStatus}`, 14, 59);

  // Customer Info
  doc.text(`Bill To:`, 120, 45);
  doc.setFontSize(10);
  doc.text(`Name: ${user.name}`, 120, 52);
  doc.text(`Email: ${user.email}`, 120, 59);
  doc.text(`Mobile: ${user.mobile || 'N/A'}`, 120, 66);

  // Table
  const tableColumn = ["Service", "Price", "Quantity", "Total"];
  const tableRows: any[] = [];

  order.services.forEach((service: any) => {
    const serviceData = [
      service.title,
      `Rs. ${service.price.toFixed(2)}`,
      service.quantity,
      `Rs. ${(service.price * service.quantity).toFixed(2)}`,
    ];
    tableRows.push(serviceData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: 'striped',
    headStyles: { fillColor: [255, 122, 0] },
    margin: { top: 10 },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY || 80;
  
  doc.setFontSize(10);
  doc.text(`Subtotal: Rs. ${order.subtotal.toFixed(2)}`, 140, finalY + 10);
  doc.text(`GST (18%): Rs. 0.00`, 140, finalY + 17);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: Rs. ${order.subtotal.toFixed(2)}`, 140, finalY + 25);

  doc.save(`Invoice_${order._id}.pdf`);
};
