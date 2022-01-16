1. create the yaml files via

`oc new-app --image=docker.io/kornkitti/express-hello-world --name=myapp2 --as-deployment-config && oc expose service/myapp2`

2. export the yaml files via 

`oc get dc/myapp2 -o yaml > dc.yaml`


`oc get service/myapp2 -o yaml > service.yaml`


`oc get route/myapp2 -o yaml > route.yaml`

------------

#### clean up the yamls

dc.yaml:
- can remove the `sha256:xxxx` tag at the end of the image
- can remove auto image deploy (cause we gonna do oc delete all with --selector anyways when deploying new images..)

service.yaml
- remove `clusterIP` and `clusterIPs`, it will be auto generated / injected by k8

------------

#### test yamls with oc apply

3. clean the enviornment and then test that the yaml files work with `oc apply` 

`oc delete all --selector app=myapp2` or `oc delete dc,service,routes,imagestream --selector app=myapp2`

`oc apply -f dc.yaml` `oc apply -f service.yaml` `oc apply -f route.yaml`

test rollout with `oc rollout latest dc/myapp2`

might need to remove this part from the dc yaml if it gives `... because it contains unresolved images` errors 

if using `from: ImageStream` and the image stream does not exist just remove this entire part:

```
....
- imageChangeParams:
        from:
          kind: ImageStreamTag
          name: 'myapp:latest' 
    ...
    `lastTriggeredImage: mydockerrepo.com/repo/myimage@sha256:xxxxxxxxxxxxxxxx`...
```

------------

4. clean the enviornment and test the same with a helm chart that injects app name values

`helm install <AppName> <ChartName>` 

it should work just fine and create the app!

------------

`helm install` worked great however running the command with different appname will give errors because k8 resources already exists

now we need to inject the appname from helm values in all templates:
- replace all `myapp2` values in dc,service,route yamls with `{{ .Values.appname }}`

dc.yaml: (important)
- replace the image name with `docker.io/nadav/client:{{ .Values.appname }}` so it takes the correct image from helm injected values

this should now work:
`helm install <release-name> <chart-name> --set appname=<k8-app-name>`

for example:
`helm install cicd-preview-performance myapp2chart --set appname=cicd-preview-performance`

------------

the cicd process should do:

#### single enviorment maker script:
1. `helm uninstall cicd-preview-${branchName}` # try to uninstall the helm release if already exists
2. `oc delete all --selector app=cicd-preview-${branchName}` # clean up leftover k8 resources with that app name if already exists
3. `helm install cicd-preview-${branchName} <chart-name> --set appname=<k8-app-name>` # install the new chart's release


#### single enviorment destroyer script:
1. `helm uninstall cicd-preview-${branchName}` # try to uninstall the helm release
2. `oc delete all --selector app=cicd-preview-${branchName}` # clean up leftover k8 resources with that app name

#### enviorment garbage collector (interval script):
1. get all active envs on helm / k8 with:
- `helm list -q --filter 'cicd-preview-*'`

or

- `oc get dc | grep cicd-preview- | awk '{ print $1 }'`

then loop over it and match with open PR branches names