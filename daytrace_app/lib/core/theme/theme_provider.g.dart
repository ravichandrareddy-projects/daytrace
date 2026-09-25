// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'theme_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(ThemeNotifier)
final themeProvider = ThemeNotifierProvider._();

final class ThemeNotifierProvider
    extends $NotifierProvider<ThemeNotifier, DayTraceThemeType> {
  ThemeNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'themeProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$themeNotifierHash();

  @$internal
  @override
  ThemeNotifier create() => ThemeNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(DayTraceThemeType value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<DayTraceThemeType>(value),
    );
  }
}

String _$themeNotifierHash() => r'745136b29a8b0782807ff38ff81ba2e1d95eb147';

abstract class _$ThemeNotifier extends $Notifier<DayTraceThemeType> {
  DayTraceThemeType build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<DayTraceThemeType, DayTraceThemeType>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<DayTraceThemeType, DayTraceThemeType>,
              DayTraceThemeType,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
