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
import config from './aws-exports';
Amplify.configure(config);

function App({ signOut }) {
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <View className="App">
        <Card>
          <Image src={logo} className="App-logo" alt="logo" />
          <Heading level={1}>We now have Auth!</Heading>
        </Card>
        <Button onClick={signOut}>Sign Out</Button>
      </View>
    </div>
  );
}

export default withAuthenticator(App);