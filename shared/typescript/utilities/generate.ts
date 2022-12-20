import { config } from "./constants";

class Generate {

	private constructor() { }
	static readonly instance = new Generate;

	serviceName(name: string) {
		return config.serviceName + "-" + name;
	}

}

export const generate = Generate.instance;