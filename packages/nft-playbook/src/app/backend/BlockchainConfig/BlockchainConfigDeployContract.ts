/**
 * Abstract Config for Deploying a Contract
 */
export abstract class BlockchainConfigDeployContract {
  private type: string;

  constructor(type: string) {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }
}
