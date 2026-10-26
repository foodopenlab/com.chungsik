import { apiGet } from "@/shared/api/client";
import type { ListResponse, Profile } from "@/shared/api/types";

export const fetchProfiles = () => apiGet<ListResponse<Profile>>("/profiles");
