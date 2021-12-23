ThisBuild / organization     := "com.redpanda"
ThisBuild / scalaVersion     := "2.12.14"
ThisBuild / version          := "1.0.0"
ThisBuild / assemblyMergeStrategy := {
    case "META-INF/services/org.apache.spark.sql.sources.DataSourceRegister" => MergeStrategy.concat
    case PathList("META-INF", xs @ _*) => MergeStrategy.discard
    case x => MergeStrategy.first
}

lazy val root = (project in file("."))
    .settings(
        name := "redpanda-examples",
        assembly / mainClass := Some("com.redpanda.examples.clients.ProducerExample"),
        libraryDependencies += "org.apache.spark" % "spark-sql_2.12" % "3.2.0",
        libraryDependencies += "org.apache.spark" % "spark-sql-kafka-0-10_2.12" % "3.2.0",
        libraryDependencies += "com.typesafe.play" %% "play-json" % "2.8.2"
    )
