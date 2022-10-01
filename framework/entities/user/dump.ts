
	/**
	 * A variant from the UserEntityGroup we absolutely know exists or have enough data to create one.
	 * @constructor
	 * @param {AbsoluteUserAttributes} attribute object with the users email, name and id.
	 */



   export class User extends Entity implements IUser {

		readonly entityType: types.EntityType = types.EntityType.User;

		readonly TypeOfSelf = User;
		readonly NullTypeOfSelf = NullUser;
		readonly AbsoluteTypeOfSelf = User;

		/* ATTRIBUTES */
		private Name: string;
		private Email: string;
		protected PrimaryAttributes: string[] = ["Email", "Name"]

		constructor(attributes: AbsoluteUserAttributes & { created?: string }) {
			super(attributes, types.EntityType.User);
			this.setupAttributes(attributes);
			// this.setAttributes(attributes); will set non null attributes
		}

		/** Configures self with attributes provided by the client */
		protected setupAttributes(params: ConstructorParameters<typeof User>[0]) {
			const { email, name } = params;
			this.Email = email; // setup attributes
			this.Name = name; // as attributes grow, move attribute setup to a seperate method
		}

		/** Sets the GSI partition keys used by self */
		protected set_GSI_keys() { } // TODO: populate

		attributes() {
			return {
				...super.attributes(), // get id, entityType, created and modified
				email: this.Email,
				name: this.Name
			};
		}

		setAttributes(attributes: MutableUserAttributes): void {
			// only overriding so I can get that nice intellisense in vscode
			super.setAttributes(attributes);
		}

		/**
		 * Use to obtain graphql representation of UserEntityGroup.User
		 * @returns {types.User}
		 */
		graphQlEntity(): GraphQlEntity<types.User> {
			const entity = {
				...super.graphQlEntity(),
				...this.attributes()
			};
			return entity;
		}

		async sync(options: SyncOptions = { exists: true }): Promise<User> {

			const { exists } = options;
			let attributes: UpdateItemOutput;

			if (exists) {
				// update cognito details first
				attributes = await this.model.mutate();
			} else {
				if (!this.validatePrimaryAttributes()) throw new Error("Not enough attributes to create new user record");
				attributes = await this.model.put();
			}

			this.setAttributes(attributes.Attributes as MutableUserAttributes);

			return this;

		}

		/** update user attributes in cognito */
		private async updateCognito() {

			const attributes = [];

			/** populate attributes to contain non null values */
			Object.entries({ email: this.Email, name: this.Name })
				.forEach(([key, value]) => {
					value !== null && value !== undefined && attributes.push({
						Name: key,
						Value: value as string
					});
				});

			const cognitoAdminUpdateParams = {
				UserPoolId: COGNITO_USER_POOL_ID!,
				Username: this.Id,
				UserAttributes: attributes
			};


			return await cognitoProvider()
				.adminUpdateUserAttributes(cognitoAdminUpdateParams) // update user attributes in the cognito user pool
				.promise();
		}

	}

	/**
	 * NULL USER:
	 * A user whose existence and variant is unverified
	 * An intermidiary you use to obtain an absolute user via it's sync method.
	 * @param {NullUserAttributes} properties object containing the id of the absolute user the client wishes to obtain.
	 */

	export class NullUser extends Entity {

		readonly entityType = types.EntityType.User;

		readonly TypeOfSelf = NullUser;
		readonly NullTypeOfSelf = NullUser;
		readonly AbsoluteTypeOfSelf = User;

		protected PrimaryAttributes: string[];

		constructor(properties: NullUserAttributes) {
			super(properties, types.EntityType.User);
		}

		protected set_GSI_keys(): void { }

		attributes(): null {
			return null;
		}

		graphQlEntity(): null {
			return null;
		}

		setAttributes(): never {
			throw new Error("Can not set mutable attributes of NullUser.");
		}

		async sync(params: SyncOptions = { exists: false }): Promise<User | never> {
			const { exists } = params;
			let attributes:any;
			if(exists) {
				attributes = (await this.model.mutate()).Attributes;
			} else {
				const { Item } = await this.model.get(); // get user record from db;
				if (!Item) throw new Error(`Could not sync user. Concrete absolute user(${+this.Id}) does not exist`);
				attributes = Item;
			}
			return new User(attributes as AbsoluteUserAttributes);
		}

	}