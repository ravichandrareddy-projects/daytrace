import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:daytrace/app/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // TODO: Initialize database, shared preferences, etc. here before runApp
  
  runApp(const ProviderScope(child: DayTraceApp()));
}
