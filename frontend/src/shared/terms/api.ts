import { apiGet } from "@/shared/api/client";
import type { ListResponse, Term } from "@/shared/api/types";

export const fetchTerms = () => apiGet<ListResponse<Term>>("/terms");
