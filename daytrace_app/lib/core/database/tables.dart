import 'package:drift/drift.dart';

class Tasks extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();
  TextColumn get description => text().nullable()();
  DateTimeColumn get scheduledStart => dateTime().nullable()();
  DateTimeColumn get scheduledEnd => dateTime().nullable()();
  TextColumn get category => text().nullable()();
  TextColumn get status => text()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get completedAt => dateTime().nullable()();
  TextColumn get notes => text().nullable()();
  
  @override
  Set<Column> get primaryKey => {id};
}

class Activities extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();
  TextColumn get category => text().nullable()();
  DateTimeColumn get startTime => dateTime().nullable()();
  DateTimeColumn get endTime => dateTime().nullable()();
  TextColumn get source => text().nullable()();
  TextColumn get notes => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  TextColumn get linkedTaskId => text().nullable()();
  
  @override
  Set<Column> get primaryKey => {id};
}

class Expenses extends Table {
  TextColumn get id => text()();
  RealColumn get amount => real()();
  TextColumn get title => text()();
  TextColumn get merchant => text().nullable()();
  TextColumn get category => text().nullable()();
  TextColumn get paymentMethod => text().nullable()();
  DateTimeColumn get date => dateTime()();
  TextColumn get time => text().nullable()();
  TextColumn get notes => text().nullable()();
  TextColumn get source => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  
  @override
  Set<Column> get primaryKey => {id};
}

class Screenshots extends Table {
  TextColumn get id => text()();
  TextColumn get mediaUri => text()();
  DateTimeColumn get capturedAt => dateTime()();
  TextColumn get detectedApp => text().nullable()();
  TextColumn get category => text().nullable()();
  TextColumn get ocrText => text().nullable()();
  TextColumn get aiSummary => text().nullable()();
  RealColumn get confidence => real().nullable()();
  BoolColumn get isFavorite => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime()();
  
  @override
  Set<Column> get primaryKey => {id};
}
