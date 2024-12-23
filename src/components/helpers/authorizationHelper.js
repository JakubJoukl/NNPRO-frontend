class AuthorizationHelper {
    ADMIN = "ADMIN";

    constructor() {
    }

    userIsAuthorities(roles) {
        return roles.includes(this.ADMIN);
    }
}
export default new AuthorizationHelper();