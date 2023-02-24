# Redpanda multi-docker-compose

This docker-compose file was created to make it easier to build and run Redpanda Data clusters for testing and development. The docker-compose file will allow you to run a single node Redpanda setup or a three, four, or five node cluster. This will also configure the Redpanda Console user interface to make it easier to 

# Configuration

## Docker Compose Profiles

There are four available profiles. Choose the appropriate one for your use case. 

* onenode
* threenode
* fournode
* fivenode

You may pass the profile name to the `--profiles` flag or the `COMPOSE_PROFILES` environment variable when running `docker compose` 

## Environment Variables

There are multiple environment variables that can be set to fine tune how this runs.

`LOG_LEVEL` - This passes the log level configuration down to the Redpanda service instances running in the containers. Valid values are info, warn, error, debug, and trace. 

The default level is `info`

`SEEDS` - This allows you to modify the Redpanda seeds list, which is used for configuring and bootstrapping the cluster initially. Additional hosts added to the cluster will use the seed list to determine how to join the cluster. 

The default seeds list is `redpanda-0:33145,redpanda-1:33145,redpanda-2:33145`

For more information on the [Redpanda documentation on configuring the seed servers](https://docs.redpanda.com/docs/deploy/deployment-option/self-hosted/manual/production/production-deployment/#configure-the-seed-servers).

`RP_VERSION` - This allows you to select the specific Redpanda container version to launch. 

The default container version is `latest`.

See the [Redpanda container details on Docker Hub](https://hub.docker.com/r/redpandadata/redpanda) for available versions.

`RP_CONSOLE_VERSION` - This allows you to select the specific Redpanda Console container version to launch.

The default container version is `latest`.

See the [Redpanda Console container details on Docker Hub](https://hub.docker.com/r/redpandadata/console) for available versions.

# Examples

## Start a Single Node instance with Console

```
SEEDS=redpanda-0 CONSOLE_PROFILES=onenode docker compose up
```

## Start a Three node instance with Console

```
CONSOLE_PROFILES=threenode docker compose up
```

## Start a Three node instance with Console using Redpanda 22.3.13

```
RP_VERSION=v22.3.13 CONSOLE_PROFILES=threenode docker compose up
```


# Accessing Redpanda

## Container Networking

The containers are all configured to live in the `redpanda_network`. Each Redpanda instance has an internal and external network listener to facilitate both client-to-Redpanda and intra-cluster Redpanda communication

There are four internal container ports opened for each Redpanda instance. 

### Internal to External port mappings

Each port is mapped outside of Docker should you require direct access to it. The port mapping is based on the Redpanda instance position (e.g., redpanda-0, redpanda-1, redpanda-2, et al), where N in the mapping below signifies the Redpanda instance position.

* 8081 -> 1N081 - Schema Registry
* 8082 -> 1N082 - Pandaproxy
* 9092 -> 1N092 - Kafka Client API service port
* 9644 -> 1N644 - Redpanda Admin

### Additional Internal ports

These are not exposed outside of the `redpanda_network`.

* 33145 - Cluster RPC port
* 28082 - Internal-only pandaproxy
* 29092 - Internal-only Kafka Client API service port

## Clients outside of Docker

To access Redpanda from clients outside of the container system, you can set your broker list to connect to `localhost:1N092` where N is 1, 2, 3, 4, or 5.  

Additionally, you can use the `rpk` command line client from within one of the Redpanda containers to interact with the cluster.

```
docker exec -it redpanda-0 rpk cluster health
```

# Accessing Redpanda Console

By default, Redpanda Console is started on port 8080. Once the `docker-compose` has completed, you can open a browser on your local system and connect to `http://localhost:8080/`. You should be presented with the default view showing overall Redpanda topic information.

# Volume persistence

The docker-compose configuration will setup persistent volumes so you can turn off and restore containers at any time. 


## Cleanup when changing cluster sizes

When changing cluster sizes from one node count to another, it is recommended that you fully destroy the containers, as well as any persistent volumes that have been created. Thsi will ensure that stray node memberships from previous cluster runs do not interfere with the starting of future cluster runs.

```
COMPOSE_PROFILES=<runningprofile> docker compose rm -v
docker volume prune 
```

# Things this docker-compose doesn't implement

* TLS
* authorization/ACLs


