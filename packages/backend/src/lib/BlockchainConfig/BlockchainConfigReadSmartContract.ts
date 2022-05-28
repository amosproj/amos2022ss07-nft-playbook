/**
 * Abstract Config for Reading a Smart Contract
 */
export abstract class BlockchainConfigReadSmartContract {
  private type: string;

  constructor(type: string) {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }
}
