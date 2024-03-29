import { CognitoUserPool } from 'amazon-cognito-identity-js';

const pooldData = {
    UserPoolId: 'ap-southeast-2_yDKdmZ7Z5',
    ClientId: '1qrrh9vjc4lt2l8tso0mfi4sks'
}

export default new CognitoUserPool(pooldData);