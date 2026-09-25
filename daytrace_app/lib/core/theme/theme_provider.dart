import 'package:shared_preferences/shared_preferences.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'daytrace_theme.dart';
import 'theme_light.dart';
import 'theme_dark.dart';
import 'theme_aurora.dart';

part 'theme_provider.g.dart';

enum DayTraceThemeType {
  light,
  dark,
  aurora,
}

@riverpod
class ThemeNotifier extends _$ThemeNotifier {
  static const _themeKey = 'daytrace_theme_preference';

  @override
  DayTraceThemeType build() {
    _loadTheme();
    return DayTraceThemeType.light; // Default until loaded
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final themeIndex = prefs.getInt(_themeKey) ?? 0;
    if (themeIndex >= 0 && themeIndex < DayTraceThemeType.values.length) {
      state = DayTraceThemeType.values[themeIndex];
    }
  }

  Future<void> setTheme(DayTraceThemeType theme) async {
    state = theme;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_themeKey, theme.index);
  }

  DayTraceThemeTokens get tokens {
    switch (state) {
      case DayTraceThemeType.light:
        return themeLight;
      case DayTraceThemeType.dark:
        return themeDark;
      case DayTraceThemeType.aurora:
        return themeAurora;
    }
  }
}
