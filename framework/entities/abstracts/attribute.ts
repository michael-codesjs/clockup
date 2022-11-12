import { IPutable } from "./interfaces";

type AttributeParams<T, N> = {
  required?: boolean,
  validate?: (value: T) => boolean,
  name: N,
  value: T,
};

export class Attribute<T = any, N = string> implements IPutable {

  protected readonly Required: boolean;
  protected readonly Name: N;
  protected Value: T;
  private readonly validate: AttributeParams<T, N>["validate"] = () => true;

  constructor({ required, validate, name, value }: AttributeParams<T, N>) {
    this.Required = required || false;
    this.Name = name;
    this.value = value;
    this.validate = validate ? validate : this.validate;
  }

  get name() { return this.Name }
  get value() { return this.Value; }
  set value(value: T) {
    // console.log("Validate:", this.validate);
    if (!this.validate(value)) throw new Error(`Invalid value for attribute ${this.name}`);
    this.Value = value;
  }

  /**
   * Determines if an attribute can be written to the database
   */

  putable(): boolean {
    return (
      (this.Required ? this.value !== undefined : true) && this.validate(this.Value)
    );
  }

}