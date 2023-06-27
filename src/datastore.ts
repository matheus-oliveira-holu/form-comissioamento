import { Datastore } from '@google-cloud/datastore'

export const datastore = new Datastore({
  projectId: "form-comissionamento",
  keyFilename: 'src\form-comissionamento-firebase-adminsdk-896ay-84cad2c2aa.json'
})