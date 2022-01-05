package io.vectorized

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.util.StdDateFormat

object Constants {
  private val jsonMapper = new ObjectMapper
  jsonMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
  jsonMapper.setDateFormat(new StdDateFormat)

  def getPersonsTopic = "persons"
  def getPersonsAvroTopic = "avro-persons"
  def getPersonsProtobufTopic = "protobuf-persons"
  def getAgesTopic = "ages"
  def getJsonMapper: ObjectMapper = jsonMapper
}