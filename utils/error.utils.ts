import { FunctionsReturnWrapper } from "@/supabase/worker.supa";

export function throwFunctionsError(
	data: FunctionsReturnWrapper<any>["data"],
	error: FunctionsReturnWrapper<any>["error"]
) {
	if (error) {
		throw new Error(error.message);
	}
	if (!data) {
		throw new Error("No data returned");
	}
	if (data.success === false) {
		throw new Error(data?.error || "Error creating stripe account");
	}
}
