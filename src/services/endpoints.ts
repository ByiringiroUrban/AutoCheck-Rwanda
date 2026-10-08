import { api } from "@/services/api";
import type {
  AdminStats,
  AiInspection,
  AuditLog,
  AvatarUploadResponse,
  CloudinaryUploadResponse,
  Dispute,
  Inspection,
  InspectionItem,
  InventoryVehicle,
  MessageResponse,
  MileageHistory,
  Organization,
  OrganizationMember,
  Ownership,
  PasswordResetVerifyResponse,
  Report,
  ServiceRecord,
  TimelineItem,
  TokenPair,
  UploadResult,
  User,
  UserPage,
  Vehicle,
} from "@/types/api";

export const endpoints = {
  register: (body: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: string;
  }) => api<User>("/api/v1/auth/register", { method: "POST", json: body, auth: false, skipAuthRedirect: true }),

  login: (body: { email: string; password: string }) =>
    api<TokenPair>("/api/v1/auth/login", { method: "POST", json: body, auth: false, skipAuthRedirect: true }),

  logout: () => api<MessageResponse>("/api/v1/auth/logout", { method: "POST" }),

  me: () => api<User>("/api/v1/auth/me"),

  forgotPassword: (email: string) =>
    api<MessageResponse>("/api/v1/auth/forgot-password", {
      method: "POST",
      json: { email },
      auth: false,
      skipAuthRedirect: true,
    }),

  verifyOtp: (email: string, otp: string) =>
    api<PasswordResetVerifyResponse>("/api/v1/auth/verify-otp", {
      method: "POST",
      json: { email, otp },
      auth: false,
      skipAuthRedirect: true,
    }),

  resetPassword: (body: { email: string; otp: string; new_password: string }) =>
    api<MessageResponse>("/api/v1/auth/reset-password", {
      method: "POST",
      json: body,
      auth: false,
      skipAuthRedirect: true,
    }),

  updateMe: (body: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
    old_password?: string;
    new_password?: string;
    password?: string;
  }) => api<User>("/api/v1/users/me", { method: "PATCH", json: body }),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api<AvatarUploadResponse>("/api/v1/users/me/avatar", { method: "POST", form });
  },

  deleteAvatar: () => api<MessageResponse>("/api/v1/users/me/avatar", { method: "DELETE" }),

  uploadGeneralImage: (file: File, folder: string = "general") => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    return api<CloudinaryUploadResponse>("/api/v1/uploads/image", { method: "POST", form });
  },

  uploadEvidenceFile: (file: File, category: string = "ownership") => {
    const form = new FormData();
    form.append("file", file);
    form.append("category", category);
    return api<CloudinaryUploadResponse>("/api/v1/uploads/evidence", { method: "POST", form });
  },

  searchVehicle: (query: { vin?: string; plate?: string }) => {
    const params = new URLSearchParams();
    if (query.vin) params.set("vin", query.vin);
    if (query.plate) params.set("plate", query.plate);
    return api<Vehicle>(`/api/v1/vehicles/search?${params.toString()}`, { auth: false, skipAuthRedirect: true });
  },

  createVehicle: (body: {
    vin: string;
    make: string;
    model: string;
    year: number;
    body_type: string;
    fuel_type: string;
    color: string;
    initial_plate?: string;
  }) => api<Vehicle>("/api/v1/vehicles", { method: "POST", json: body }),

  vehicleTimeline: (id: string) => api<TimelineItem[]>(`/api/v1/vehicles/${id}/timeline`),

  vehicleMileage: (id: string) => api<MileageHistory>(`/api/v1/vehicles/${id}/mileage`),

  uploadImage: (vehicleId: string, file: File, viewType: string, sourceType: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("view_type", viewType);
    form.append("source_type", sourceType);
    return api<UploadResult>(`/api/v1/vehicles/${vehicleId}/images`, { method: "POST", form });
  },

  claimOwnership: (body: { vehicle_id: string; evidence_url?: string }) =>
    api<Ownership>("/api/v1/ownership/claims", { method: "POST", json: body }),

  myVehicles: () => api<Ownership[]>("/api/v1/ownership/my-vehicles"),

  applyOrganization: (body: {
    name: string;
    type: string;
    tin: string;
    location: string;
    email: string;
    phone: string;
  }) =>
    api<Organization>("/api/v1/garages/applications", { method: "POST", json: body, skipAuthRedirect: true }),

  myGarage: () => api<Organization>("/api/v1/garages/me"),

  updateMyGarage: (body: { name?: string; phone?: string; email?: string; location?: string }) =>
    api<Organization>("/api/v1/garages/me", { method: "PATCH", json: body }),

  garageInventory: () => api<InventoryVehicle[]>("/api/v1/garages/inventory"),

  garageStaff: () => api<OrganizationMember[]>("/api/v1/garages/staff"),

  inviteStaff: (body: { email: string; first_name: string; last_name: string; phone?: string; role: string }) =>
    api<OrganizationMember>("/api/v1/garages/staff", { method: "POST", json: body }),

  updateStaff: (id: string, body: { role?: string; status?: string }) =>
    api<OrganizationMember>(`/api/v1/garages/staff/${id}`, { method: "PATCH", json: body }),

  pendingGarages: () => api<Organization[]>("/api/v1/garages/pending"),

  updateGarageStatus: (id: string, status: string) =>
    api<Organization>(`/api/v1/garages/${id}/status`, { method: "PATCH", json: { status } }),

  createServiceRecord: (body: {
    vehicle_id: string;
    mileage: number;
    service_type: string;
    description: string;
    service_date?: string;
  }) => api<ServiceRecord>("/api/v1/service-records", { method: "POST", json: body }),

  createInspection: (body: { vehicle_id: string; mileage: number; inspection_type: string; summary?: string }) =>
    api<Inspection>("/api/v1/inspections", { method: "POST", json: body }),

  addInspectionItem: (
    id: string,
    body: { category: string; item: string; condition: string; severity: string; notes?: string },
  ) => api<InspectionItem>(`/api/v1/inspections/${id}/items`, { method: "POST", json: body }),

  completeInspection: (id: string, summary?: string) =>
    api<Inspection>(`/api/v1/inspections/${id}/complete`, { method: "POST", json: { summary } }),

  createAiInspection: (body: { vehicle_id: string; inspection_id?: string; image_urls?: string[] }) =>
    api<AiInspection>("/api/v1/ai-inspections", { method: "POST", json: body }),

  getAiInspection: (id: string) => api<AiInspection>(`/api/v1/ai-inspections/${id}`),

  generateReport: (vehicleId: string) =>
    api<Report>("/api/v1/reports", { method: "POST", json: { vehicle_id: vehicleId } }),

  myReports: () => api<Report[]>("/api/v1/reports/my"),

  getReport: (id: string) => api<Report>(`/api/v1/reports/${id}`, { auth: false }),

  createDispute: (body: {
    vehicle_id: string;
    target_type: string;
    target_id: string;
    reason: string;
    details: string;
    evidence_url?: string;
  }) => api<Dispute>("/api/v1/disputes", { method: "POST", json: body }),

  myDisputes: () => api<Dispute[]>("/api/v1/disputes/my"),

  adminDisputes: () => api<Dispute[]>("/api/v1/admin/disputes"),

  resolveDispute: (
    id: string,
    body: {
      status: string;
      resolution_notes: string;
      target_type?: string;
      target_id?: string;
      corrected_payload?: { mileage?: number; description?: string; service_type?: string };
    },
  ) => api<Dispute>(`/api/v1/admin/disputes/${id}`, { method: "PATCH", json: body }),

  auditLogs: () => api<AuditLog[]>("/api/v1/admin/audit-logs"),

  adminStats: () => api<AdminStats>("/api/v1/admin/stats"),

  adminUsers: (query?: { page?: number; role?: string; search?: string }) => {
    const params = new URLSearchParams();
    params.set("page", String(query?.page || 1));
    params.set("limit", "20");
    if (query?.role) params.set("role", query.role);
    if (query?.search) params.set("search", query.search);
    return api<UserPage>(`/api/v1/admin/users?${params.toString()}`);
  },

  updateAdminUser: (id: string, body: { role?: string; status?: string }) =>
    api<User>(`/api/v1/admin/users/${id}`, { method: "PATCH", json: body }),
};
