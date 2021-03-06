import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  TextField,
  InputAdornment,
  Box,
  Button,
  Link,
  Snackbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { CHANGE_FORM_VIEW } from '../../../redux/actions/actionTypes';
import { register, login } from '../../../redux/actions/authActions';
import { clearError } from '../../../redux/actions/errorActions';

const marginBottom = '1.5rem';
const useStyle = makeStyles((theme) => ({
  container: {
    width: '75%',
  },
  textField: {
    borderRadius: '27px',
    height: '3rem',
    paddingLeft: '20px',
    marginBottom,
    color: '#444040',
  },
  labelStyle: {
    left: '5px',
  },
  textBoxContainer: {
    marginBottom,
  },
  buttonStyle: {
    borderRadius: '27px',
    height: '3rem',
    backgroundColor: theme.palette.primary.main,
    color: '#FCFCFC',
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: '2rem',
    },
    textTransform: 'capitalize',
  },
  mainText: {
    fontSize: '2rem',
  },
  subText: {
    fontSize: '1rem',
  },
  forgotPassword: {
    paddingLeft: '20px',
    color: '#444040',
    position: 'absolute',
    top: '-14px',
  },
  signIn: {
    color: '#444040',
    position: 'absolute',
    top: '-14px',
    right: '20px',
    [theme.breakpoints.down('xs')]: {
      left: '20px',
      top: '14px',
    },
  },
  snackBar: {
    backgroundColor: '#F44336',
  },
}));

//Form types
const LOGIN = 'LOGIN';
const REGISTER = 'REGISTER';

//Form link types
const SIGN_UP = 'SIGN_UP';
const SIGN_IN = 'SIGN_IN';

function Form({ type }) {
  const classes = useStyle();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.error.msg);
  const [open, setOpen] = useState(false);
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSnackbarClose = () => {
    setOpen(false);
    dispatch(clearError());
  };

  useEffect(() => {
    if (error) setOpen(true);
  }, [error]);

  const nameComponent = createTextFieldComponent(classes, {
    name: 'username',
    label: 'Username',
    value: username,
    icon: 'fas fa-user',
    type: 'text',
    setter: setName,
  });

  const emailComponent = createTextFieldComponent(classes, {
    name: 'email',
    label: 'Email',
    value: email,
    icon: 'fas fa-envelope',
    type: 'email',
    setter: setEmail,
  });

  const passwordComponent = createTextFieldComponent(classes, {
    name: 'password',
    label: 'Password',
    value: password,
    icon: 'fas fa-lock',
    type: 'password',
    setter: setPassword,
  });

  const { mainText, subText, buttonText, rightLinkText } = setTexts(type);

  const linkOptions = (
    <div style={{ position: 'relative', marginBottom }}>
      {/*Link that's to the right of the form */}
      {SuperLinks(
        {
          classes: { root: classes.signIn },
          href: '#',
          underline: 'always',
          onClick: linkFunctionality(
            type !== LOGIN ? SIGN_IN : SIGN_UP,
            dispatch
          ),
        },
        rightLinkText
      )}
    </div>
  );

  return (
    <Box classes={{ root: classes.container }}>
      <div className={classes.textBoxContainer}>
        <Typography classes={{ root: classes.mainText }} variant='h3'>
          {mainText}
        </Typography>
        <Typography classes={{ root: classes.subText }}>{subText}</Typography>
      </div>

      <form
        className={classes.form}
        onSubmit={formFunctionality(
          { username, email, password },
          type,
          dispatch
        )}
      >
        {type === REGISTER && nameComponent}
        {emailComponent}
        {passwordComponent}
        {linkOptions}

        <Button
          classes={{ root: classes.buttonStyle }}
          fullWidth
          variant='contained'
          type='submit'
        >
          {buttonText}
        </Button>

        {/*Error display*/}
        <Snackbar
          classes={{ root: classes.Snackbar }}
          open={open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          key='bottom center'
        >
          <Alert variant='filled' severity='error' elevation={6}>
            {error}
          </Alert>
        </Snackbar>
      </form>
    </Box>
  );
}

function setTexts(formType) {
  let mainText = '';
  let subText = '';
  let buttonText = '';
  let rightLinkText = '';

  switch (formType) {
    case LOGIN:
      mainText = 'Welcome Back';
      subText = 'sign into your account';
      buttonText = 'Log In';
      rightLinkText = "Don't have an account? Sign up";
      break;
    case REGISTER:
      mainText = 'Create Your Account';
      subText = 'and start today';
      buttonText = 'Create Account';
      rightLinkText = 'Already have an account? Sign in';
      break;

    default:
      subText = '';
      buttonText = '';
      rightLinkText = '';
      break;
  }
  return { mainText, subText, buttonText, rightLinkText };
}

function createTextFieldComponent(classes, config) {
  return (
    <TextField
      id={config.name}
      name={config.name}
      type={config.type}
      label={config.label}
      variant='outlined'
      value={config.value}
      onChange={(e) => config.setter(e.target.value)}
      fullWidth
      required
      InputLabelProps={{ classes: { root: classes.labelStyle } }}
      InputProps={{
        classes: {
          root: classes.textField,
        },
        startAdornment: (
          <InputAdornment position='start'>
            <i className={config.icon}></i>
          </InputAdornment>
        ),
      }}
    />
  );
}

function SuperLinks(props, text) {
  return <Link {...props}>{text}</Link>;
}

/**
 * @param {*} type Link type
 * @param {*} dispatch Dispatch function
 */
function linkFunctionality(type, dispatch) {
  switch (type) {
    case SIGN_UP:
      return (e) => {
        e.preventDefault();
        dispatch({ type: CHANGE_FORM_VIEW, payload: REGISTER });
      };

    case SIGN_IN:
      return (e) => {
        e.preventDefault();
        dispatch({ type: CHANGE_FORM_VIEW, payload: LOGIN });
      };

    default:
      break;
  }
}

/**
 * @param {*} userData The user's data that was entered in the form
 * @param {*} type The form type: Sign up or Login
 * @param {*} dispatch Dispatch function
 */
function formFunctionality(userData, type, dispatch) {
  const { username, email, password } = userData;
  switch (type) {
    case REGISTER:
      return (e) => {
        e.preventDefault();
        dispatch(register({ username, email, password }));
      };

    case LOGIN:
      return (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
      };

    default:
      break;
  }
}

Form.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Form;
