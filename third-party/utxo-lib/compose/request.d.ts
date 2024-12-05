import type { ComposeInput, ComposeOutput, ComposeChangeAddress, ComposeRequest, ComposeResultError, CoinSelectRequest } from '../types';
type Request = ComposeRequest<ComposeInput, ComposeOutput, ComposeChangeAddress>;
export declare function validateAndParseRequest(request: Request): CoinSelectRequest | ComposeResultError;
export {};
//# sourceMappingURL=request.d.ts.map