1. create the yaml files via

`oc new-app --image=docker.io/kornkitti/express-hello-world --name=myapp2 --as-deployment-config && oc expose service/myapp2`

2. export the yaml files via 

`oc get dc/myapp2 -o yaml`
`oc get service/myapp2 -o yaml`
`oc get route/myapp2 -o yaml`

3. clean the enviornment and then test that the yaml files work with `oc apply` 

`oc delete all --selector app=myapp2` or `oc delete dc,service,routes --selector app=myapp2`


4. clean the enviornment and test the same with a helm chart that injects app name values

`helm command...`


------------

the cicd process should do:

1. enviorment maker:
- `oc delete all --selector app=cicd-preview-${branchName}` (to make sure it's destroyed and clean before we do helm install)
- `helm install --name=cicd-preview-${branchName}`

2. enviorment destroyer:
- `oc delete all --selector app=cicd-preview-${branchName}`