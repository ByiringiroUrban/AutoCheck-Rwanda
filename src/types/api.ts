export type Role =
  | "PUBLIC"
  | "OWNER"
  | "GARAGE_STAFF"
  | "GARAGE_MANAGER"
  | "DEALER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: Role | string;
  status: string;
  created_at: string;
  updated_at?: string | null;
}

export interface UserPage {
  items: User[];
  total: number;
  page: number;
  pages: number;
}

export interface InventoryVehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  current_plate?: string | null;
  latest_mileage?: number | null;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface VehiclePlate {
  id: string;
  vehicle_id: string;
  plate_number: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
}

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  body_type: string;
  fuel_type: string;
  color: string;
  status: string;
  created_at: string;
  updated_at?: string | null;
  current_plate?: string | null;
  plates?: VehiclePlate[] | null;
  latest_mileage?: number | null;
}

export interface MileageRecord {
  id: string;
  vehicle_id: string;
  mileage: number;
  recorded_at: string;
  source_type: string;
  source_id?: string | null;
  has_rollback_warning: boolean;
}

export interface MileageHistory {
  vehicle_id: string;
  records: MileageRecord[];
  has_rollback_anomaly: boolean;
  anomaly_details?: string | null;
  latest_mileage?: number | null;
}

export interface TimelineItem {
  id: string;
  event_type: string;
  date: string;
  title: string;
  description: string;
  source_type: string;
  source_name?: string | null;
  mileage?: number | null;
  severity?: string | null;
}

export interface ServiceRecord {
  id: string;
  vehicle_id: string;
  organization_id?: string | null;
  mileage: number;
  service_type: string;
  description: string;
  service_date: string;
  source_type: string;
  created_by: string;
  created_at: string;
  organization_name?: string | null;
  creator_name?: string | null;
}

export interface InspectionItem {
  id: string;
  inspection_id: string;
  category: string;
  item: string;
  condition: string;
  severity: string;
  notes?: string | null;
  created_at: string;
}

export interface Inspection {
  id: string;
  vehicle_id: string;
  organization_id?: string | null;
  mileage: number;
  inspection_type: string;
  status: string;
  summary?: string | null;
  inspected_at: string;
  created_by: string;
  created_at: string;
  items?: InspectionItem[] | null;
  organization_name?: string | null;
}

export interface AiFinding {
  id: string;
  ai_inspection_id: string;
  image_id?: string | null;
  defect_type: string;
  location: string;
  severity: string;
  confidence: number;
  bbox?: number[] | null;
  image_url?: string | null;
}

export interface AiInspection {
  id: string;
  vehicle_id: string;
  inspection_id?: string | null;
  model_version: string;
  status: string;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  findings: AiFinding[];
  total_defects_found: number;
}

export interface ScoreDeduction {
  category: string;
  reason: string;
  points_deducted: number;
}

export interface ScoreBreakdown {
  total_score: number;
  rating: string;
  formula_version: string;
  base_score: number;
  deductions: ScoreDeduction[];
  summary: string;
}

export interface ReportSnapshot {
  vehicle: Vehicle;
  current_plate?: string | null;
  plate_history?: Record<string, unknown>[];
  ownership_count: number;
  verified_ownership: boolean;
  latest_mileage?: number | null;
  mileage_rollback_warning: boolean;
  score: ScoreBreakdown;
  service_history: ServiceRecord[];
  inspection_history: Inspection[];
  ai_visible_defects: AiFinding[];
  timeline: TimelineItem[];
  dispute_count: number;
  disclaimer: string;
}

export interface Report {
  id: string;
  vehicle_id: string;
  requested_by?: string | null;
  generated_at: string;
  score: number;
  score_breakdown: ScoreBreakdown;
  snapshot: ReportSnapshot;
  status: string;
  created_at: string;
}

export interface Ownership {
  id: string;
  vehicle_id: string;
  user_id: string;
  verified: boolean;
  start_date: string;
  end_date?: string | null;
  evidence_url?: string | null;
  status: string;
  created_at: string;
  vehicle?: Vehicle | null;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  user?: User | null;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  tin: string;
  location: string;
  email: string;
  phone: string;
  logo_url?: string | null;
  status: string;
  created_at: string;
  members?: OrganizationMember[] | null;
}

export interface Dispute {
  id: string;
  vehicle_id: string;
  user_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  details: string;
  evidence_url?: string | null;
  status: string;
  resolution_notes?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  metadata_json?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface AdminStats {
  total_vehicles: number;
  total_users: number;
  total_garages: number;
  total_reports_generated: number;
  total_inspections: number;
  open_disputes: number;
  system_status: string;
}

export interface UploadResult {
  upload_url: string;
  file_id: string;
  view_type: string;
}

export interface MessageResponse {
  message: string;
  success?: boolean;
}

export interface PasswordResetVerifyResponse {
  valid: boolean;
  email?: string | null;
  first_name?: string | null;
  message?: string | null;
}

export interface AvatarUploadResponse {
  avatar_url: string;
  public_id?: string;
  message: string;
}

export interface CloudinaryUploadResponse {
  url: string;
  public_id: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  resource_type?: string;
}

