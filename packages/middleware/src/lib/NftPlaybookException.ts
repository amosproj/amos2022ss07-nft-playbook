export class NftPlaybookException {
  errorMessage: string;
  error: object;

  constructor(errorMessage: string, error: object) {
    this.errorMessage = errorMessage;
    this.error = error;
  }
}
