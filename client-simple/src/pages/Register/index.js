import React, { Component } from "react";
import { Form, FormInput, FormFooterText } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import "./Register.style.scss";
import { UserContext } from "../../services/userContext";

class Register extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    errorMsg: null
  }

  resetState = () => this.setState({ firstName: "", lastName: "", email: "", password: "" });

  handleFormSubmit = signUp => async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = this.state;
    console.log("Submitting registration...", { firstName, lastName, email, password });
    const registerRes = await signUp({ firstName, lastName, email, password });
    const err = this.handleRegisterError(registerRes);
    console.log(`registerRes: `, JSON.stringify(registerRes));
    if (!err) this.props.history.push("/");
    this.resetState();
  };

  handleRegisterError = registerRes => {
    if (registerRes instanceof Error) { //eslint-disable-line valid-typeof
      const errorMsg = registerRes.message;
      console.log(`Register. errorMsg: `, errorMsg);
      this.setState({errorMsg});
      return errorMsg;
    } else {
      this.setState({errorMsg: null});
      return null;
    }
  }

  renderFormFooter() {
    return (<>
        <FormFooterText>Already have an account? <a href="/login" className="form__link">Go to Login</a></FormFooterText>
        <FormFooterText><a href="/" className="form__link">Go back</a> to the Homepage</FormFooterText>
      </>);
  }

  render() {
    const { name, username, email, password, errorMsg } = this.state;

    return <div className="page">
      <div className="page__wrapper page__wrapper--absolute register__wrapper">
        <UserContext.Consumer>
          {({ signUp }) =>
            (<Form
              heading="Register"
              onSubmit={this.handleFormSubmit(signUp)}
              formFooter={() => this.renderFormFooter()}>
              <FormInput
                label="First name / Nickname"
                id="name"
                placeholder="John"
                value={name}
                onChange={e => this.setState({firstName: e.target.value})} />

              <FormInput
                label="Last Name"
                id="username"
                placeholder="Doe"
                value={username}
                onChange={e => this.setState({lastName: e.target.value})} />

              <FormInput
                label="E-mail Address"
                id="email"
                placeholder="example@example.com"
                value={email}
                onChange={e => this.setState({email: e.target.value})} />

              <FormInput
                label="Password"
                id="passwd"
                placeholder="Password"
                value={password}
                type="password"
                onChange={e => this.setState({password: e.target.value})} />
              <Button variant="primary" additionalClass="form__btn">Register</Button>
              {errorMsg ? <p className="form__error">{errorMsg}</p> : ""}
            </Form>
            )}
        </UserContext.Consumer>
      </div>
    </div>;
  }
}

export default Register;
