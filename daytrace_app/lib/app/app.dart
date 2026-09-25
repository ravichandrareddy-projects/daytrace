import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:daytrace/app/router.dart';
import 'package:daytrace/core/theme/theme_provider.dart';
import 'package:daytrace/core/theme/typography.dart';

class DayTraceApp extends ConsumerWidget {
  const DayTraceApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final themeTokens = ref.watch(themeProvider.notifier).tokens;
    
    return MaterialApp.router(
      title: 'DayTrace',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: ThemeData(
        scaffoldBackgroundColor: themeTokens.background,
        colorScheme: ColorScheme.fromSeed(
          seedColor: themeTokens.primary,
          brightness: themeTokens.background.computeLuminance() > 0.5 
              ? Brightness.light 
              : Brightness.dark,
          surface: themeTokens.surface,
        ),
        textTheme: DayTraceTypography.buildTextTheme(themeTokens),
        extensions: [themeTokens],
      ),
    );
  }
}
