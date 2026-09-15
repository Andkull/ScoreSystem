import {
  BaseError,
  ContractFunctionRevertedError,
  UserRejectedRequestError,
} from "viem";

// Turns viem's verbose errors into a short message fit for the UI.
export function getErrorMessage(error: unknown): string {
  if (error instanceof BaseError) {
    const revert = error.walk(
      (e) => e instanceof ContractFunctionRevertedError,
    );
    if (revert instanceof ContractFunctionRevertedError && revert.reason) {
      return revert.reason;
    }
    if (error.walk((e) => e instanceof UserRejectedRequestError)) {
      return "Transaction rejected in wallet";
    }
    return error.shortMessage;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
