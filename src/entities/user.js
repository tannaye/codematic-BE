export default class User {
    constructor({ _id, first_name, last_name, email, phone, password, role, status, status_reason }) {
        this._id = _id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.status = status;
        this.status_reason = status_reason;
    }

    toObject() {
        return {
            _id: this._id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            phone: this.phone,
            password: this.password,
            role: this.role,
            status: this.status,
            status_reason: this.status_reason,
        };
    }

    static createRules() {
        return {
            first_name: "required|string",
            last_name: "required|string",
            email: "required|email",
            phone: "required|string|phone",
            password: "required|string",
        };
    }

    static updateRules() {}

    static loginRules() {
        return {
            role: "string",
            email: "required|email",
            password: "required|string",
        };
    }

    static CUSTOMER = "customer";
    static ADMIN = "admin";
}
