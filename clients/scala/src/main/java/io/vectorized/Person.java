package io.vectorized;

import java.util.Date;

public final class Person {
  public String firstName;
  public String lastName;
  public Date birthDate;
  public String city;
  public String ipAddress;

  public Person() {}

  public Person(final String firstName,
  final String lastName,
  final Date birthDate,
  final String city,
  final String ipAddress) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.city = city;
    this.ipAddress = ipAddress;
  }

  public Person(final String firstName,
  final String lastName,
  final Date birthDate) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
  }

  @Override
  public String toString() {
    return "Person{" +
      "firstName='" + firstName + '\'' +
      ", lastName='" + lastName + '\'' +
      ", birthDate=" + birthDate +
      ", city='" + city + '\'' +
      ", ipAddress='" + ipAddress + '\'' +
      '}';
  }
}