/**
 * Abstract Config for reading user data from a smart contract
 */
export abstract class BlockChainConfigReadTokenData {
  private type: string;

  constructor(type: string) {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }
}
