import chalk from "chalk";
import parseArgs from "minimist";
import fetch from "node-fetch";
import path from "path";
import { promises as fs } from "fs";

let args = parseArgs(process.argv.slice(2));
const helpShort = `
  ${chalk.red("registry.js")} - manage subjects and schema versions in the Redpanda registry.

  ${chalk.bold("USAGE")}

  > node registry help [-l]
  > node registry [-r host:port] [additional_commands]
  > node registry config [list | set]
  > node registry schema list [schema_id]
  > node registry subject [subject_name] [list | add | delete | config]

  By default the registry script will print this help menu.
  Use the arguments ${chalk.red("help -l")} to print the long help menu.

  ${chalk.bold("OPTIONS")}

      -h, --help                  Shows this help message

      -l                          Combined with the help argument, shows the long help menu.

      -r, --registry [host:port]  The host and port for the registry
                                    default: localhost:8081
`;
const helpLong = `
  ${chalk.bold("ALL COMMANDS")}

      config        Manages the registry configuration

                    Usage:
                    node registry config list
                    node registry config set compatibilityLevel=[backwards | forwards | full | none]

      help          Shows the basic help message

                    Usage:
                    node registry help
                    node registry help all

      schema        Manages schemas in the registry

                    Usage:
                    node registry schema list [schema_id]

      subject       Manages subjects in the registry

                    Usage:
                    node registry subject list
                    node registry subject [subject_name] list
                    node registry subject [subject_name] list [version_number]
                    node registry subject [subject_name] add [file_path]
                    node registry subject [subject_name] delete
                    node registry subject [subject_name] delete [version_number]
                    node registry subject [subject_name] config list
                    node registry subject [subject_name] config set compatibilityLevel=[backward | forward | full | none]

  ${chalk.bold("EXAMPLES")}

      View the registry global configuration:

          > node registry config list

      Set the registry global compatibility level to FORWARD:

          > node registry config set compatibilityLevel=forward

      Add a new Avro schema version to the subject avro-activity-value:

        > node registry subject avro-activity-value add ../../schemas/market_activity.avsc

      View a schema with id 1:

          > node registry schema list 1

      Add a new Protobuf schema version to the subject proto-activity-value:

        > node registry subject proto-activity-value add ../../schemas/market_activity.proto

      View all subjects in the registry:

        > node registry subject list

      List all schema versions for the subject avro-activity-value:

        > node registry subject avro-activity-value versions

      View version 1 schema for the subject avro-activity-value:

        > node registry subject avro-activity-value version 1

      Set the compatibility level to none for subject avro-activity-value:

        > node registry subject avro-activity-value config set compatibilityLevel=none

      View the config for the subject avro-activity-value:

        > node registry subject avro-activity-value config list

      Delete schema version 1 from subject avro-activity-value:

        > node registry subject avro-activity-value delete 1

      Delete subject and all schema versions for subject proto-activity-value:

        > node registry subject proto-activity-value delete
`;

if (
  (Object.keys(args).length === 1 && args._.length === 0) ||
  args._[0] === "help" ||
  args.help ||
  args.h
) {
  console.log(helpShort);
  if (args.l) console.log(helpLong);
  process.exit(0);
}

const registry = args.registry || args.r || "localhost:8081";

switch (args._[0]) {
  case "config":
    switch (args._[1]) {
      case "list":
        const response = await fetch(`http://${registry}/config`, {
          method: "GET",
          headers: { accept: "application/vnd.schemaregistry.v1+json" },
        });
        if (!response.ok) {
          throw new Error(`error ${response.status} getting registry global config`);
        }
        const result = await response.json();
        const length = Object.keys(result).reduce(
          (acc, val) => (acc >= val.length ? acc : val.length),
          0
        );
        console.log(`
${chalk.bold("KEY".padEnd(length + 4))}${chalk.bold("VALUE")}`);
        Object.entries(result).forEach(([key, val]) => {
          console.log(`${key.padEnd(length + 4)}${val}`);
        });
        console.log();
        break;
      case "set":
        if (args._[2] && args._[2].includes("=")) {
          let [key, val] = args._[2].split("=");
          switch (key.toLowerCase()) {
            case "compatibilitylevel":
            case "compatibility":
              if (
                val.toLowerCase() === "backward" ||
                val.toLowerCase() === "backwards" ||
                val.toLowerCase() === "forward" ||
                val.toLowerCase() === "forwards" ||
                val.toLowerCase() === "full" ||
                val.toLowerCase() === "none"
              ) {
                if (val.charAt(val.length - 1) === "s") val = val.slice(0, -1);
                const response = await fetch(`http://${registry}/config`, {
                  method: "PUT",
                  headers: {
                    accept: "application/vnd.schemaregistry.v1+json",
                    "Content-Type": "application/vnd.schemaregistry.v1+json",
                  },
                  body: `{"compatibility":"${val.toUpperCase()}"}`,
                });
                if (!response.ok) {
                  throw new Error(`error ${response.status} setting registry global config`);
                }
                const result = await response.json();
                const length = Object.keys(result).reduce(
                  (acc, val) => (acc >= val.length ? acc : val.length),
                  0
                );
                console.log(`
${chalk.bold("KEY".padEnd(length + 4))}${chalk.bold("VALUE")}`);
                Object.entries(result).forEach(([key, val]) => {
                  console.log(`${key.padEnd(length + 4)}${val}`);
                });
                console.log();
              }
              break;
            default:
              console.log(`
Invalid property assignment ${chalk.bold(args._[2])}

${chalk.red("node registry config set")} accepts the following config properties:

    compatibility, compatibilityLevel           Sets the global schema compatibilitiy level
                                                  Valid values: forward, backward, full, none
`);
              break;
          }
          break;
        }
      default:
        console.log(`
Invalid argument ${chalk.bold(args._[1])}

${chalk.red("node registry config")} accepts the following arguments:

        list
        set [property]=[value]

Run ${chalk.red("node registry help -l")} for more details.
`);
        break;
    }
    break;
  case "schema":
  case "schemas":
    switch (args._[1]) {
      case "list":
        if (args._[2] === undefined) {
          console.log(`
${chalk.bold("schema_id")} undefined

${chalk.red("node registry schema list [schema_id]")}

Run ${chalk.red("node registry help -l")} for more details.
`);
          break;
        }
        if (isNaN(args._[2])) {
          console.error(`Invalid schema id ${args._[2]}`);
          break;
        }
        const response = await fetch(`http://${registry}/schemas/ids/${args._[2]}`, {
          method: "GET",
          headers: { accept: "application/vnd.schemaregistry.v1+json" },
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText} for ${response.url}`);
        }
        const length = Object.keys(result).reduce(
          (acc, val) => (acc >= val.length ? acc : val.length),
          0
        );
        console.log(`
${JSON.stringify(JSON.parse(result.schema), null, 2)}
`);
        break;
      default:
        console.log(`
Invalid argument ${chalk.bold(args._[1])}

${chalk.red("node registry schema")} accepts the following arguments:

        list [schema_id]

Run ${chalk.red("node registry help -l")} for more details.
`);
        break;
    }
    break;
  case "subject":
  case "subjects":
    let subjectHandled = false;
    if (args._[1] === "list" && args._[2] === undefined) {
      subjectHandled = true;
      const response = await fetch(`http://${registry}/subjects`, {
        method: "GET",
        headers: { accept: "application/vnd.schemaregistry.v1+json" },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} for ${response.url}`);
      }
      console.log(`
${chalk.bold("SUBJECT")}`);
      result.forEach((subject) => {
        console.log(subject);
      });
      console.log();
      break;
    }
    const subjectName = args._[1];
    if ((args._[2] === "version" || args._[2] === "versions") && args._[3] === undefined) {
      subjectHandled = true;
      const response = await fetch(`http://${registry}/subjects/${subjectName}/versions`, {
        method: "GET",
        headers: { accept: "application/vnd.schemaregistry.v1+json" },
      });
      const result = await response.json();
      if (!response.ok) {
        console.error(`
${response.status} ${response.statusText} for ${response.url}
`);
        break;
      }
      console.log(`
${chalk.bold(`SCHEMA VERSIONS ${subjectName}`)}`);
      result.forEach((subject) => {
        console.log(subject);
      });
      console.log();
    }
    if ((args._[2] === "version" || args._[2] === "versions") && args._[3] !== undefined) {
      subjectHandled = true;
      const subjectListVersion = args._[3];
      const response = await fetch(
        `http://${registry}/subjects/${subjectName}/versions/${subjectListVersion}`,
        {
          method: "GET",
          headers: { accept: "application/vnd.schemaregistry.v1+json" },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        console.error(`
${response.status} ${response.statusText} for ${response.url}
`);
        break;
      }
      let titles = "";
      let values = "";
      let schema = "";
      Object.entries(result).forEach(([header, value], i, arr) => {
        if (i === arr.length - 1) {
          try {
            schema = JSON.stringify(JSON.parse(value), null, 2);
          } catch (_) {
            schema = value;
          }
          return;
        }
        value = value.toString();
        const length = header.length >= value.length ? header.length : value.length;
        titles += header.padEnd(length + 4);
        values += value.padEnd(length + 4);
      });
      console.log(`
${chalk.bold(titles.toUpperCase())}
${values}

${schema}
`);
    }
    if (args._[2] === "add" && args._[3] !== undefined) {
      subjectHandled = true;
      const filePath = args._[3];
      const fileExt = path.extname(filePath);
      const file = await fs.readFile(filePath, "utf-8");
      let fileHandled = false;
      let bodyStr = "";

      if (fileExt.toLowerCase() === ".avsc" || fileExt.toLowerCase() === ".avro") {
        fileHandled = true;
        const fileJson = JSON.parse(file);
        const schemaStr = escapeJson(fileJson);
        const body = {
          schema: schemaStr,
          schemaType: "AVRO",
        };

        bodyStr = escapeJson(body);
      }
      if (fileExt.toLowerCase() === ".proto") {
        fileHandled = true;
        let schemaStr = file.replace(/"/g, '"');
        schemaStr = schemaStr.replace(/\n/g, "");
        const body = {
          schemaType: "PROTOBUF",
          schema: schemaStr,
        };
        bodyStr = escapeJson(body);
      }
      if (fileHandled) {
        const response = await fetch(`http://${registry}/subjects/${subjectName}/versions`, {
          method: "POST",
          headers: {
            accept: "application/vnd.schemaregistry.v1+json",
            "Content-Type": "application/vnd.schemaregistry.v1+json",
          },
          body: bodyStr,
        });
        const result = await response.json();
        console.log(`
${chalk.bold(`SCHEMA VERSION for ${subjectName}`)}
${result.id}
`);
      } else {
        console.log(`
Invalid file extension ${fileExt} (valid options: .avro, .avsc, .proto)
`);
      }
    }
    if (args._[2] === "delete" && args._[3] === undefined) {
      subjectHandled = true;
      const response = await fetch(`http://${registry}/subjects/${subjectName}`, {
        method: "DELETE",
        headers: { accept: "application/vnd.schemaregistry.v1+json" },
      });
      const result = await response.json();
      console.log(result);
    }
    if (args._[2] === "delete" && args._[3] !== undefined) {
      subjectHandled = true;
      const version = args._[3];
      const response = await fetch(
        `http://${registry}/subjects/${subjectName}/versions/${version}`,
        {
          method: "DELETE",
          headers: { accept: "application/vnd.schemaregistry.v1+json" },
        }
      );
      const result = await response.json();
      console.log(result);
    }
    if (args._[2] === "config" && args._[3] === "list") {
      subjectHandled = true;
      const response = await fetch(`http://${registry}/config/${subjectName}`, {
        method: "GET",
        headers: { accept: "application/vnd.schemaregistry.v1+json" },
      });
      const result = await response.json();
      const length = Object.keys(result).reduce(
        (acc, val) => (acc >= val.length ? acc : val.length),
        0
      );
      console.log(`
${chalk.bold("KEY".padEnd(length + 4))}${chalk.bold("VALUE")}`);
      Object.entries(result).forEach(([key, val]) => {
        console.log(`${key.padEnd(length + 4)}${val}`);
      });
      console.log();
    }
    if (args._[2] === "config" && args._[3] === "set") {
      subjectHandled = true;
      if (args._[4] && args._[4].includes("=")) {
        let [key, val] = args._[4].split("=");
        switch (key.toLowerCase()) {
          case "compatibilitylevel":
          case "compatibility":
            if (
              val.toLowerCase() === "backward" ||
              val.toLowerCase() === "backwards" ||
              val.toLowerCase() === "forward" ||
              val.toLowerCase() === "forwards" ||
              val.toLowerCase() === "full" ||
              val.toLowerCase() === "none"
            ) {
              if (val.charAt(val.length - 1) === "s") val = val.slice(0, -1);
              const response = await fetch(`http://${registry}/config/${subjectName}`, {
                method: "PUT",
                headers: {
                  accept: "application/vnd.schemaregistry.v1+json",
                  "Content-Type": "application/vnd.schemaregistry.v1+json",
                },
                body: `{"compatibility":"${val.toUpperCase()}"}`,
              });
              if (!response.ok) {
                throw new Error(`error ${response.status} setting registry global config`);
              }
              const result = await response.json();
              const length = Object.keys(result).reduce(
                (acc, val) => (acc >= val.length ? acc : val.length),
                0
              );
              console.log(`
${chalk.bold("KEY".padEnd(length + 4))}${chalk.bold("VALUE")}`);
              Object.entries(result).forEach(([key, val]) => {
                console.log(`${key.padEnd(length + 4)}${val}`);
              });
              console.log();
            }
            break;
          default:
            console.log(`
Invalid property assignment ${chalk.bold(args._[2])}

${chalk.red("node registry config set")} accepts the following config properties:

  compatibility, compatibilityLevel           Sets the global schema compatibilitiy level
                                                Valid values: forward, backward, full, none
`);
            break;
        }
        break;
      }
    }
    if (!subjectHandled) {
      console.log(`
Invalid argument ${chalk.bold(args._.join(" "))}

${chalk.red("node registry subject [subject_name]")} accepts the following arguments:

        list
        add [file_path]
        delete
        delete [version_number]
        config

Run ${chalk.red("node registry help -l")} for more details.
`);
    }
    break;
  default:
    console.log(`
Invalid argument ${chalk.bold(args._[0])}

See ${chalk.red("node registry help")}
`);
    break;
}

process.exit(0);

function escapeJson(json) {
  return JSON.stringify(json).replace(/"/g, '"');
}
