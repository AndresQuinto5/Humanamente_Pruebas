import { useState } from "react";
import "./formInput.css";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, options, ...inputProps } = props;

const handleFocus = (e) => {
  setFocused(true);
};

const handleBlur = (e) => {
  setFocused(e.target.checkValidity());

  // Si el tipo de input es "email", realiza la validación adicional
  if (inputProps.type === "email" && !validateEmail(e.target.value)) {
    e.target.setCustomValidity(errorMessage);
  } else {
    e.target.setCustomValidity("");
  }
  
};

const validateEmail = (email) => {
  // Esta es la expresión regular para validar el correo electrónico.
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(String(email).toLowerCase());
};


if (inputProps.type === "email") {
  return (
    <div className="formInput">
      <label>{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={() =>
          inputProps.name === "confirmPassword" && setFocused(true)
        }
        focused={focused.toString()}
        pattern={inputProps.pattern}
        onInvalid={e => {
          if (!validateEmail(e.target.value)) {
            e.target.setCustomValidity(errorMessage);
          } else {
            e.target.setCustomValidity("");
          }
        }}
      />
      <span>{errorMessage}</span>
    </div>
  );
}

  return (
    <div className="formInput">
      <label>{label}</label>
      <input
          {...inputProps}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={() =>
            inputProps.name === "confirmPassword" && setFocused(true)
          }
          focused={focused.toString()}
          pattern={inputProps.pattern}
        />
      <span>{errorMessage}</span>
    </div>
  );
};

export default FormInput;