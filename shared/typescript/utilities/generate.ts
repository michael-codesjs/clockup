import { config } from "./constants";

class Generate {

	private constructor() { }
	static readonly instance = new Generate;

	serviceName<T extends string>(name: T): `clockup-${T}` {
		return `${config.serviceName}-${name}`;;
	}

	stateMachineName<T extends string>(name: T): `ClockUp${T}\$\{self:custom.stage\}` {
		return `ClockUp${name}$\{self:custom.stage\}`;
	}
	

}

export const generate = Generate.instance;