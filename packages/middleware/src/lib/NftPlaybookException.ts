export class NftPlaybookException {
  errorMessage: string;
  error: unknown;

  constructor(errorMessage: string, error: unknown) {
    this.errorMessage = errorMessage;
    this.error = error;
  }
}
