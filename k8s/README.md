# uisf-foyer on kubernetes

Files in this folder can be used to deploy this LWC app to a k8s cluster.

## Perequisites
- Docker Desktop 
- Enable Kubernetes Cluster in Docker Desktop: https://docs.docker.com/desktop/kubernetes/
- Verify that you can see the `docker-desktop` cluster: `kubectl config view`

<!-- ## deploy foyer/postgres
From: `cd uisf-foyer/k8s/scripts/`
Run deploy script: `./start_app.sh` 
(To cleanup the resources): `./cleanup.sh` -->
## Important Files
The `Dockerfile` file that sits on the top level of this directory is used by docker to create the image of the
container. This image will be used in the configuration of the k8s cluster via the `deployment.yaml` file. The
`.yaml` file is used to describe Kubernetes objects and can be used to easily create and destroy your app in any
Kubernetes environment. Read more at the [offical docker docs](https://docs.docker.com/get-started/kube-deploy/).

## Quickstart
After configuring the `Dockerfile` and `deployment.yaml` to your liking (it is already set to a basic configuration),
simple run the script in `/k8s/scripts/run_docker.sh`.

Access the app via `localhost:30001`.
## Important Commands
### view deployed pods
`kubectl get pods`

### view k8 deployments
`kubectl get deployments`
### view services
`kubectl get services`

### kill k8 clusters
`kubectl delete -f deployment.yaml` (assuming you are in the top-level directory)
