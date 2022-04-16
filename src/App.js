
import './App.css';
import app from './firebase.init';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

const auth = getAuth(app);




function App() {
  const googleProvider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user
        console.log(user)
      }).catch((error) => {
        console.error(error)
      });
  }

  const facebookProvider = new FacebookAuthProvider();
  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log(user)
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [register, setRegister] = useState(false)

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }
  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }
  const handleRegistrasion = event => {
    setRegister(event.target.checked);
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('send mail')
      });
  }
  const handleForgetPassword = event => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent")
        // ..
      })
  }
  const handleSubmit = event => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*\d)/.test(password)) {
      setError('Please include a number');
      return;
    }
    setValidated(true);

    if (register) {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          console.log(userCredential.user);
          setEmail('');
          setPassword('');
        })
        .catch(error => {
          console.error(error);
          setError(error.message)

        });
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          console.log(userCredential.user);
          setEmail('');
          setPassword('');
          verifyEmail();
        })
        .catch(error => {
          console.error(error);
          setError(error.message)

        });
    }

    event.preventDefault();
  }

  return (
    <div>
      <div className='w-50 mx-auto mt-5'>
        <h2 className='text-primary'>Please {register ? 'log-In' : 'Register'} </h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label >Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label >Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please choose a Password.
            </Form.Control.Feedback>
          </Form.Group>
          <p className='text-danger'>{error}</p>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegistrasion} type="checkbox" label="Already Registerd" />
          </Form.Group>
          <Button variant="dark" onClick={handleForgetPassword}>Forget Password</Button>
          <br />
          <Button className='my-4' variant="danger" type="submit">
            {register ? 'log-In' : 'Register'}
          </Button>
          <br />
          <Button className='mb-4' variant='success' onClick={handleGoogleSignIn}>Google</Button>
          <br />
          <Button variant='primary' onClick={handleFacebookSignIn}>FaceBook</Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
