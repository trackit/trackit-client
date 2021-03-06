import React from 'react';
import { FormComponent } from '../FormComponent';
import { shallow } from "enzyme";
import Form from 'react-validation/build/form';
import Spinner from 'react-spinkit';

const props = {
  submit: jest.fn()
};

const form = {
  getValues: () => ({
    email: "email",
    password: "password"
  })
};

const propsForRegistration = {
  ...props,
  registration: true
};

const propsWithLoginError = {
  ...props,
  loginStatus: {
    status: false,
    error: "error"
  }
};

const propsForRegistrationSpinner = {
  ...props,
  registration: true,
  registrationStatus: {}
};

const propsWithRegistrationError = {
  ...propsForRegistrationSpinner,
  registrationStatus: {
    status: false,
    error: "error"
  }
};

const propsForLoginSpinner = {
  ...props,
  loginStatus: {}
};

describe('<FormComponent />', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders a <FormComponent /> component', () => {
    const wrapper = shallow(<FormComponent {...props}/>);
    expect(wrapper.length).toBe(1);
  });

  it('renders <Form/> component if token is not available', () => {
    const wrapper = shallow(<FormComponent {...props}/>);
    const form = wrapper.find(Form);
    expect(form.length).toBe(1);
  });

  it('renders <Form/> component if in registration mode', () => {
    const wrapper = shallow(<FormComponent {...propsForRegistration}/>);
    const form = wrapper.find(Form);
    expect(form.length).toBe(1);
  });

  it('can submit credentials to log user in', () => {
    const wrapper = shallow(<FormComponent {...props}/>);
    const instance = wrapper.instance();
    instance.form = form;
    expect(props.submit).not.toHaveBeenCalled();
    wrapper.instance().submit({ preventDefault(){} });
    expect(props.submit).toHaveBeenCalled();
  });

  it('renders <div/> component if there is a login error', () => {
    const wrapper = shallow(<FormComponent {...propsWithLoginError}/>);
    const form = wrapper.find("div.alert");
    expect(form.length).toBe(1);
  });

  it('renders <div/> component if there is a registration error', () => {
    const wrapper = shallow(<FormComponent {...propsWithRegistrationError}/>);
    const form = wrapper.find("div.alert");
    expect(form.length).toBe(1);
  });

  it('renders <Spinner/> component if waiting for data', () => {
    const registration = shallow(<FormComponent {...propsForRegistrationSpinner}/>);
    let spinners = registration.find(Spinner);
    expect(spinners.length).toBe(1);
    const login = shallow(<FormComponent {...propsForLoginSpinner}/>);
    spinners = login.find(Spinner);
    expect(spinners.length).toBe(1);
  });

});