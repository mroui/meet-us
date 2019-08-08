import React, { Component } from "react";
import { UserContext } from "../../services/userContext";
import { withRouter } from "react-router-dom";
import { Form, FormInput, FormFooterText } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import "./Login.style.scss";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errorMsg: null
  }

  resetState = () => this.setState({ password: "" });

  handleLoginError = loginRes => {
    if (loginRes instanceof Error) { //eslint-disable-line valid-typeof
      const errorMsg = loginRes.message.substring(14);
      console.log(`login. errorMsg: `, errorMsg);
      this.setState({errorMsg});
      return errorMsg;
    } else {
      this.setState({errorMsg: null});
      return null;
    }
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  handleFormSubmit = logIn => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { email, password } = this.state;
    if (email=="" || password=="") {
      this.setState({errorMsg: "Fill empty fields"});
      return;
    }
    console.log("Submitting login...", {email, password});
    const loginRes = await logIn(email, password);
    const err = this.handleLoginError(loginRes);
    if (!err) this.props.history.push("/"); // DK: This causes react error
    this.resetState();
  }

  renderFormFooter() {
    return (
      <>
        <FormFooterText>Don't have an account? <a href="/register" className="form__link">Go to Register</a></FormFooterText>
        <FormFooterText><a href="/" className="form__link">Go back</a> to the Homepage</FormFooterText>
      </>
    );
  }

  render() {
    const { email, password, errorMsg } = this.state;

    return (
      <div className="page">
        <div className="page__wrapper page__wrapper--absolute login__wrapper">
          <UserContext.Consumer>
            {({ logIn }) => (
              <Form
                heading="Login"
                onSubmit={this.handleFormSubmit(logIn)}
                formFooter={() => this.renderFormFooter()}>
                <FormInput
                  label="E-mail Address"
                  id="email"
                  placeholder="example@example.com"
                  value={email}
                  type="email"
                  onChange={e => this.setState({email: e.target.value})} />

                <FormInput
                  label="Password"
                  id="passwd"
                  placeholder="Password"
                  value={password}
                  type="password"
                  onChange={e => this.setState({password: e.target.value})} />

                <Button variant="primary" type="submit" additionalClass="form__btn">Login</Button>
                {errorMsg ? <p className="form__error">{errorMsg}</p> : ""}
              </Form>
            )}
          </UserContext.Consumer>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
