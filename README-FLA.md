# Information on the adaption for FLA

## Build own images

````
# from project root
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build

# re-tag and push
docker tag <image-id> guenltu/private:fla-cvat-server-m1
docker push guenltu/private:fla-cvat-server-m1

docker tag <image-id> guenltu/private:fla-cvat-ui-m1
    docker push guenltu/private:fla-cvat-ui-m1
````

````
# execute from the project root
docker build --force-rm --tag guenltu/private:fla-cvat-opa --file Dockerfile.opa .
docker push guenltu/private:fla-cvat-opa
````



## Run on K8 prerequisites

````
# add repo for helm dependencies; needed only once
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo list
````

````
# update dependencies
helm repo update
cd ./helm-chart
helm dependency update
````

````
# install ngix ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
or
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx
````

````
# access to private repo
kubectl create secret docker-registry regcred \
--docker-server=docker.io \
--docker-username=dockerhub_username \
--docker-password=dockerhub_password  \
--docker-email=dockerhub_email

spec:
  containers:
    - name: ...
...
  imagePullSecrets:
    - name: regcred
````


````
# create super user when helm chart is running; only needed once for pv
kubectl get all
kubectl exec -it pod/cvat-backend-<pod-id> -c cvat-backend-app-container -- python manage.py createsuperuser
````


## Run on K8 

````
# from project root
helm upgrade cvat --install ./helm-chart -f ./helm-chart/values.yaml

# port forward to access from localhost
kubectl port-forward service/ingress-nginx-controller 8080:80
````

http://fla-cvat.localdev.me:8080/
http://fla-cvat.localdev.me:8080/api/swagger/
http://fla-cvat.localdev.me:8080/admin


````
# uninstall
helm uninstall cvat
````


## Update repository from origin

````
# add original repository as remote 'upstream' and verify
# need to do only once
git remote add upstream git@github.com:openvinotoolkit/cvat.git
git remote -v
````

````
# fetch updates from original repository
git fetch upstream

# switch to your develop branch
git checkout develop
git pull

# merge develop branch from upstream
git merge upstream/develop

# push updates to fork
git push origin develop

# merge with your current branch
git checkout user/guen
git merge develop
git push
````


