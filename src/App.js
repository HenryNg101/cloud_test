import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { listNotes } from './graphql/queries';
import { API, Storage } from "aws-amplify";
import { useState, useEffect } from "react";

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = awsConfig.oauth.redirectSignIn.split(",");

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = awsConfig.oauth.redirectSignOut.split(",");

const updatedAwsConfig = {
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
  }
}

Amplify.configure(updatedAwsConfig);

const initialFormState = { user: '', image: '' }

function App({ signOut, user }) {
  const [formData, setFormData] = useState(initialFormState);

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, user: user.username, image: file.name });
    await Storage.put(file.name, file);
  }

  async function createNote() {
    console.log(formData);
    if(!formData.image) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    /*if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }*/
    //Tell user here that image upload is succeeded
    console.log("Image uploaded successfully");
    setFormData(initialFormState);
  }

  return (
    <div className="App">
      <h1>Welcome to Nubers App</h1>
      <h2>Please upload your identification file by clicking the button below, for identification check</h2>
      <input
        type="file"
        onChange={onChange}
      />
      <button onClick={createNote}>Upload file</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default withAuthenticator(App);