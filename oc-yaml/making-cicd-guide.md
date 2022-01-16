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

# TODO
`helm command...` 


------------

the cicd process should do:

1. enviorment maker:
- `oc delete all --selector app=cicd-preview-${branchName}` (to make sure it's destroyed and clean before we do helm install)
# TODO
- `helm install --name=cicd-preview-${branchName} --values=...name...`

2. enviorment destroyer:
- `oc delete all --selector app=cicd-preview-${branchName}`