"use client";

import { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Search,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  ArrowRight,
  Building2,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import {
  RoleType,
  ROLE_DISPLAY_NAMES,
  isProtectedSuperAdmin,
  getAllowedTargetRoles,
} from "@/lib/rbac";

export type UserType = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: RoleType;
  status?: "ACTIVE" | "SUSPENDED";
  partnerId?: string | null;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type PartnerOption = {
  id: string;
  name: string;
  branchCode?: string;
  city?: string;
  state?: string;
};

type Props = {
  initialUsers: UserType[];
  initialPartners?: PartnerOption[];
  currentUser?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
};

export function AdminUsersManager({ initialUsers, initialPartners = [], currentUser }: Props) {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [partners, setPartners] = useState<PartnerOption[]>(initialPartners);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isProcessing, setIsProcessing] = useState(false);

  // Active Dropdown Menu tracking
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Role Change Modal state
  const [roleModalUser, setRoleModalUser] = useState<UserType | null>(null);
  const [selectedTargetRole, setSelectedTargetRole] = useState<RoleType | "">("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [roleStep, setRoleStep] = useState<"SELECT" | "CONFIRM">("SELECT");

  // Status Change (Suspend / Reactivate) Modal state
  const [statusModalData, setStatusModalData] = useState<{
    user: UserType;
    newStatus: "ACTIVE" | "SUSPENDED";
  } | null>(null);

  // User Details Modal state
  const [detailsUser, setDetailsUser] = useState<UserType | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdownId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Fetch updated users & partners from API
  const refreshUserData = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsers(data.users);
        if (data.partners) setPartners(data.partners);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Open Role Change Modal
  const handleOpenRoleModal = (user: UserType, initialRole?: RoleType) => {
    const allowed = getAllowedTargetRoles(user.role);
    setRoleModalUser(user);
    setSelectedTargetRole(initialRole || (allowed.length > 0 ? allowed[0].role : ""));
    setSelectedPartnerId(user.partnerId || "");
    setRoleStep("SELECT");
    setOpenDropdownId(null);
  };

  // Execute Role Change API
  const handleConfirmRoleChange = async () => {
    if (!roleModalUser || !selectedTargetRole) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${roleModalUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedTargetRole,
          partnerId: selectedPartnerId || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === roleModalUser._id
              ? {
                  ...u,
                  role: selectedTargetRole,
                  partnerId: selectedPartnerId || null,
                }
              : u
          )
        );
        setRoleModalUser(null);
        toast.success(
          data.message ||
            `Role updated to ${ROLE_DISPLAY_NAMES[selectedTargetRole] || selectedTargetRole}`
        );
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user role");
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Status Change Modal
  const handleOpenStatusModal = (user: UserType, newStatus: "ACTIVE" | "SUSPENDED") => {
    setStatusModalData({ user, newStatus });
    setOpenDropdownId(null);
  };

  // Execute Status Change API
  const handleConfirmStatusChange = async () => {
    if (!statusModalData) return;

    const { user, newStatus } = statusModalData;
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
        );
        setStatusModalData(null);
        toast.success(
          newStatus === "SUSPENDED"
            ? `User ${user.name} suspended successfully.`
            : `User ${user.name} reactivated successfully.`
        );
      } else {
        toast.error(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper: Partner name lookup
  const getPartnerName = (partnerId?: string | null) => {
    if (!partnerId) return null;
    const partner = partners.find((p) => p.id === partnerId);
    return partner ? `${partner.name} (${partner.branchCode || partner.city})` : "Assigned Center";
  };

  // Filter users by search query and role tabs
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.mobile && user.mobile.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    if (roleFilter === "CUSTOMERS") return user.role === "CUSTOMER";
    if (roleFilter === "STAFF") return user.role === "PARTNER_STAFF";
    if (roleFilter === "PARTNERS") return user.role === "PARTNER_ADMIN";
    if (roleFilter === "ADMINS") return isProtectedSuperAdmin(user.role);

    return true;
  });

  // Dynamic filter tab counts
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
  const staffCount = users.filter((u) => u.role === "PARTNER_STAFF").length;
  const partnerAdminCount = users.filter((u) => u.role === "PARTNER_ADMIN").length;
  const superAdminCount = users.filter((u) => isProtectedSuperAdmin(u.role)).length;

  return (
    <>
      {/* Search Bar & Role Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-600 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search User Name, Mobile, Email..."
            className="w-full bg-white border-2 border-slate-200 hover:border-violet-200 focus:border-violet-600 rounded-xl pl-10 pr-9 py-2 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-violet-600/10 outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-white bg-slate-200 hover:bg-violet-600 rounded-full w-4.5 h-4.5 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs font-semibold no-scrollbar">
          {[
            { id: "ALL", label: `All Users (${users.length})` },
            { id: "CUSTOMERS", label: `Customers (${customerCount})` },
            { id: "STAFF", label: `Partner Staff (${staffCount})` },
            { id: "PARTNERS", label: `Partner Admins (${partnerAdminCount})` },
            { id: "ADMINS", label: `Super Admins (${superAdminCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === tab.id
                  ? "bg-violet-600 text-white shadow-xs font-bold"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center text-gray-400 shadow-2xs space-y-2">
          <UserX size={32} className="mx-auto text-gray-300" />
          <p className="text-sm font-bold text-gray-700">No users match your criteria</p>
          <p className="text-xs text-gray-400">Try adjusting your search query or filter tab.</p>
        </div>
      ) : (
        <>
          {/* Mobile User Cards View (< md) */}
          <div className="block md:hidden space-y-3">
            {filteredUsers.map((user) => {
              const isSelf = currentUser && (currentUser.id === user._id || currentUser.email === user.email);
              const isSuper = isProtectedSuperAdmin(user.role);
              const isSuspended = user.status === "SUSPENDED";

              return (
                <div
                  key={user._id}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3"
                >
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-[#7C3AED] flex items-center justify-center font-black text-xs uppercase">
                        {user.name ? user.name.slice(0, 2) : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                          {isSelf && (
                            <span className="text-[9px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Mail size={11} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isSuper
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : user.role === "PARTNER_ADMIN"
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          : user.role === "PARTNER_STAFF"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {ROLE_DISPLAY_NAMES[user.role] || user.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          isSuspended
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSuspended ? "bg-red-500" : "bg-emerald-500"
                          }`}
                        />
                        {user.status || "ACTIVE"}
                      </span>

                      {user.partnerId && (
                        <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          <Building2 size={10} />
                          {getPartnerName(user.partnerId)}
                        </span>
                      )}
                    </div>

                    {/* Mobile Dynamic Actions */}
                    <div className="flex items-center gap-2">
                      {isSuper ? (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200 flex items-center gap-1">
                          <Lock size={11} /> Protected
                        </span>
                      ) : user.role === "CUSTOMER" ? (
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200 transition-colors cursor-pointer"
                        >
                          Promote
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
                        >
                          Change Role
                        </button>
                      )}

                      {/* Mobile More Actions Trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === user._id ? null : user._id);
                        }}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
                        aria-label="More actions"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Dropdown Menu Drawer/Popup */}
                  {openDropdownId === user._id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-slate-50 rounded-xl border border-gray-200 space-y-1 text-xs"
                    >
                      <button
                        onClick={() => {
                          setDetailsUser(user);
                          setOpenDropdownId(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white text-gray-700 font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <Eye size={13} className="text-violet-600" /> View Account Details
                      </button>

                      {!isSuper && !isSelf && (
                        <>
                          <button
                            onClick={() => handleOpenRoleModal(user)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white text-gray-700 font-semibold flex items-center gap-2 cursor-pointer"
                          >
                            <UserCheck size={13} className="text-indigo-600" />
                            {user.role === "CUSTOMER" ? "Promote User Role" : "Change User Role"}
                          </button>

                          {isSuspended ? (
                            <button
                              onClick={() => handleOpenStatusModal(user, "ACTIVE")}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 size={13} className="text-emerald-600" /> Reactivate Account
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenStatusModal(user, "SUSPENDED")}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-700 font-semibold flex items-center gap-2 cursor-pointer"
                            >
                              <ShieldAlert size={13} className="text-red-600" /> Suspend Account
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop User Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-800">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-600 font-extrabold">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Role & Center</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs bg-white">
                  {filteredUsers.map((user) => {
                    const isSelf = currentUser && (currentUser.id === user._id || currentUser.email === user.email);
                    const isSuper = isProtectedSuperAdmin(user.role);
                    const isSuspended = user.status === "SUSPENDED";
                    const isDropdownOpen = openDropdownId === user._id;

                    return (
                      <tr key={user._id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Name & Avatar */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-[#7C3AED] flex items-center justify-center font-black text-xs uppercase">
                              {user.name ? user.name.slice(0, 2) : "U"}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">{user.name}</span>
                                {isSelf && (
                                  <span className="text-[9px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-gray-400 font-medium">
                                Joined {user.createdAt ? formatDateTime(user.createdAt).split(",")[0] : "Recently"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact info */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <div className="text-gray-900 font-medium flex items-center gap-1.5">
                              <Mail size={12} className="text-gray-400" />
                              <span>{user.email}</span>
                            </div>
                            {user.mobile && (
                              <div className="text-gray-500 text-[11px] flex items-center gap-1.5">
                                <Phone size={11} className="text-gray-400" />
                                <span>{user.mobile}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Role & Partner Center */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isSuper
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : user.role === "PARTNER_ADMIN"
                                  ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                  : user.role === "PARTNER_STAFF"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {ROLE_DISPLAY_NAMES[user.role] || user.role}
                            </span>

                            {user.partnerId && (
                              <div className="text-[10px] text-purple-700 font-semibold flex items-center gap-1">
                                <Building2 size={10} className="shrink-0" />
                                <span className="truncate max-w-[180px]">
                                  {getPartnerName(user.partnerId)}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isSuspended
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSuspended ? "bg-red-500" : "bg-emerald-500"
                              }`}
                            />
                            {user.status || "ACTIVE"}
                          </span>
                        </td>

                        {/* Dynamic Actions Column */}
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5 relative">
                            {isSuper ? (
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200 flex items-center gap-1">
                                <Lock size={12} /> Protected Account
                              </span>
                            ) : user.role === "CUSTOMER" ? (
                              <button
                                onClick={() => handleOpenRoleModal(user)}
                                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 transition-colors cursor-pointer text-xs"
                              >
                                Promote
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenRoleModal(user)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition-colors cursor-pointer text-xs"
                              >
                                Change Role
                              </button>
                            )}

                            {/* More Actions Dropdown */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(isDropdownOpen ? null : user._id);
                                }}
                                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
                                aria-label="More actions"
                              >
                                <MoreVertical size={15} />
                              </button>

                              {isDropdownOpen && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl border border-gray-200 shadow-xl py-1.5 z-40 text-left space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                                >
                                  <button
                                    onClick={() => {
                                      setDetailsUser(user);
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-800 flex items-center gap-2 cursor-pointer transition-colors"
                                  >
                                    <Eye size={13} className="text-violet-600" /> View Details
                                  </button>

                                  {!isSuper && !isSelf && (
                                    <>
                                      <button
                                        onClick={() => handleOpenRoleModal(user)}
                                        className="w-full px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-800 flex items-center gap-2 cursor-pointer transition-colors"
                                      >
                                        <UserCheck size={13} className="text-indigo-600" />
                                        {user.role === "CUSTOMER"
                                          ? "Promote Role"
                                          : "Change Role"}
                                      </button>

                                      <div className="border-t border-gray-100 my-1" />

                                      {isSuspended ? (
                                        <button
                                          onClick={() => handleOpenStatusModal(user, "ACTIVE")}
                                          className="w-full px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer transition-colors"
                                        >
                                          <CheckCircle2 size={13} className="text-emerald-600" />
                                          Reactivate Account
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleOpenStatusModal(user, "SUSPENDED")}
                                          className="w-full px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                                        >
                                          <ShieldAlert size={13} className="text-red-600" />
                                          Suspend Account
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =================================================================== */}
      {/* 1. DYNAMIC ROLE CHANGE MODAL                                        */}
      {/* =================================================================== */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    {roleStep === "SELECT" ? "Change User Role" : "Confirm Role Transition"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {roleModalUser.name} ({roleModalUser.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {roleStep === "SELECT" ? (
              <div className="space-y-4">
                {/* Current Role Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Current Role
                    </span>
                    <span className="text-sm font-black text-gray-900">
                      {ROLE_DISPLAY_NAMES[roleModalUser.role] || roleModalUser.role}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-2xs">
                    {roleModalUser.status || "ACTIVE"}
                  </span>
                </div>

                {/* Target Role Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                    Select New Role
                  </label>
                  <div className="space-y-2">
                    {getAllowedTargetRoles(roleModalUser.role).map((option) => {
                      const isSelected = selectedTargetRole === option.role;
                      return (
                        <div
                          key={option.role}
                          onClick={() => setSelectedTargetRole(option.role)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? "bg-purple-50/80 border-purple-600 shadow-xs"
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="targetRole"
                            checked={isSelected}
                            onChange={() => setSelectedTargetRole(option.role)}
                            className="mt-1 accent-purple-600 cursor-pointer"
                          />
                          <div className="space-y-0.5">
                            <div className="text-xs font-black text-gray-900">{option.label}</div>
                            <div className="text-[11px] text-gray-500 font-medium leading-relaxed">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Partner Center Assignment (if assigning PARTNER_ADMIN or PARTNER_STAFF) */}
                {(selectedTargetRole === "PARTNER_ADMIN" || selectedTargetRole === "PARTNER_STAFF") && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 size={13} className="text-purple-600" />
                      Assign to Partner Center
                    </label>
                    <select
                      value={selectedPartnerId}
                      onChange={(e) => setSelectedPartnerId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-slate-200 focus:border-purple-600 text-xs font-semibold text-gray-900 outline-none transition-all cursor-pointer"
                    >
                      <option value="">-- Select Partner Center (Optional) --</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.branchCode ? `[${p.branchCode}]` : ""} ({p.city || "Center"})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Links the user to process services and orders for this branch.
                    </p>
                  </div>
                )}

                {/* Warning note */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                  <p className="text-[11px] leading-relaxed font-medium">
                    {selectedTargetRole === "CUSTOMER"
                      ? "Demoting to Customer will revoke all administrative dashboards and partner access immediately."
                      : "Promoting this user will grant access to internal dashboard tools according to the chosen role."}
                  </p>
                </div>

                {/* Modal Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setRoleModalUser(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setRoleStep("CONFIRM")}
                    disabled={!selectedTargetRole}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-black shadow-md shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Continue to Confirm</span> <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Final Confirmation */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-700">
                    Review Role Transition
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-white text-gray-800 font-black text-xs border border-gray-200 shadow-2xs">
                      {ROLE_DISPLAY_NAMES[roleModalUser.role] || roleModalUser.role}
                    </span>
                    <ArrowRight size={16} className="text-purple-600" />
                    <span className="px-3 py-1 rounded-xl bg-purple-600 text-white font-black text-xs shadow-sm">
                      {ROLE_DISPLAY_NAMES[selectedTargetRole] || selectedTargetRole}
                    </span>
                  </div>
                  {selectedPartnerId && (
                    <div className="text-xs font-bold text-purple-900 pt-1">
                      Assigned Center: {getPartnerName(selectedPartnerId)}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-600 text-center font-medium leading-relaxed">
                  Are you sure you want to apply this role change to <b>{roleModalUser.name}</b>?
                  This action will be logged in the security audit trail.
                </p>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setRoleStep("SELECT")}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmRoleChange}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessing && <RefreshCw size={14} className="animate-spin" />}
                    <span>Confirm Role Change</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. SUSPEND / REACTIVATE CONFIRMATION MODAL                          */}
      {/* =================================================================== */}
      {statusModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              {statusModalData.newStatus === "SUSPENDED" ? (
                <ShieldAlert size={24} />
              ) : (
                <CheckCircle2 size={24} className="text-emerald-600" />
              )}
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-gray-900">
                {statusModalData.newStatus === "SUSPENDED"
                  ? "Suspend User Account?"
                  : "Reactivate User Account?"}
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {statusModalData.newStatus === "SUSPENDED" ? (
                  <>
                    Are you sure you want to suspend <b>{statusModalData.user.name}</b>? The user will
                    be locked out of placing orders, submitting service requests, and accessing the portal.
                  </>
                ) : (
                  <>
                    Restore full platform and ordering access for <b>{statusModalData.user.name}</b>?
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setStatusModalData(null)}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={isProcessing}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                  statusModalData.newStatus === "SUSPENDED"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-600/30"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
                }`}
              >
                {isProcessing && <RefreshCw size={14} className="animate-spin" />}
                <span>
                  {statusModalData.newStatus === "SUSPENDED" ? "Suspend Account" : "Reactivate Account"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. USER DETAILS INSPECTION MODAL                                    */}
      {/* =================================================================== */}
      {detailsUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                  {detailsUser.name ? detailsUser.name.slice(0, 2).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{detailsUser.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{detailsUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailsUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Account ID</span>
                <span className="font-mono font-bold text-gray-900">{detailsUser._id}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Mobile Phone</span>
                <span className="font-bold text-gray-900">{detailsUser.mobile || "N/A"}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Role</span>
                <span className="font-black text-purple-700">
                  {ROLE_DISPLAY_NAMES[detailsUser.role] || detailsUser.role}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Status</span>
                <span
                  className={`font-bold ${
                    detailsUser.status === "SUSPENDED" ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {detailsUser.status || "ACTIVE"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Partner Center</span>
                <span className="font-bold text-gray-800">
                  {getPartnerName(detailsUser.partnerId) || "None (Direct Customer)"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Registered Date</span>
                <span className="font-semibold text-gray-700">
                  {detailsUser.createdAt ? formatDateTime(detailsUser.createdAt) : "N/A"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setDetailsUser(null)}
                className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

