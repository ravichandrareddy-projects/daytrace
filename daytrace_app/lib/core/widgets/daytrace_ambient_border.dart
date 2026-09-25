import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/theme_provider.dart';
import '../theme/daytrace_theme.dart';

class DayTraceAmbientBorder extends ConsumerWidget {
  const DayTraceAmbientBorder({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeType = ref.watch(themeProvider);
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return IgnorePointer(
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Inner shadow
          Container(
            decoration: BoxDecoration(
              boxShadow: _getInnerShadow(themeType, themeTokens),
            ),
          ),
          
          // Bottom Corner Glows
          ..._getCornerGlows(themeType),
          
          // Bottom animated border line (simplification: static gradient or simple container for now)
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            child: Container(
              decoration: BoxDecoration(
                gradient: _getBorderGradient(themeType, themeTokens),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<BoxShadow> _getInnerShadow(DayTraceThemeType type, DayTraceThemeTokens tokens) {
    switch (type) {
      case DayTraceThemeType.light:
        return [
          const BoxShadow(color: Color(0x1F6366F1), blurRadius: 24, spreadRadius: 0, blurStyle: BlurStyle.inner),
          const BoxShadow(color: Color(0x4000F0FF), offset: Offset(0, 3), blurRadius: 12, spreadRadius: 0, blurStyle: BlurStyle.inner),
        ];
      case DayTraceThemeType.dark:
        return [
          const BoxShadow(color: Color(0x1400F5A6), blurRadius: 28, spreadRadius: 0, blurStyle: BlurStyle.inner),
          const BoxShadow(color: Color(0x380DD1E0), offset: Offset(0, 3), blurRadius: 16, spreadRadius: 0, blurStyle: BlurStyle.inner),
        ];
      case DayTraceThemeType.aurora:
        return [
          const BoxShadow(color: Color(0x1F00E699), blurRadius: 28, spreadRadius: 0, blurStyle: BlurStyle.inner),
          const BoxShadow(color: Color(0x3800CBE8), offset: Offset(0, 3), blurRadius: 16, spreadRadius: 0, blurStyle: BlurStyle.inner),
        ];
    }
  }

  List<Widget> _getCornerGlows(DayTraceThemeType type) {
    // Left and right corner glows using large blurred containers
    Color leftColor1, leftColor2, rightColor1, rightColor2;
    
    switch (type) {
      case DayTraceThemeType.light:
        leftColor1 = const Color(0x4022D3EE); // cyan-400/25
        leftColor2 = const Color(0x266366F1); // indigo-500/15
        rightColor1 = const Color(0x33D946EF); // fuchsia-500/20
        rightColor2 = const Color(0x26F472B6); // pink-400/15
        break;
      case DayTraceThemeType.dark:
        leftColor1 = const Color(0x3334D399); // emerald-400/20
        leftColor2 = const Color(0x1A14B8A6); // teal-500/10
        rightColor1 = const Color(0x33A855F7); // purple-500/20
        rightColor2 = const Color(0x1A818CF8); // indigo-400/10
        break;
      case DayTraceThemeType.aurora:
        leftColor1 = const Color(0x4034D399); // emerald-400/25
        leftColor2 = const Color(0x262DD4BF); // teal-400/15
        rightColor1 = const Color(0x336366F1); // indigo-500/20
        rightColor2 = const Color(0x262DD4BF); // teal-400/15
        break;
    }

    return [
      Positioned(
        left: -32,
        bottom: -32,
        width: 160,
        height: 160,
        child: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: [leftColor1, leftColor2, Colors.transparent],
              stops: const [0.0, 0.5, 1.0],
            ),
          ),
        ),
      ),
      Positioned(
        right: -32,
        bottom: -32,
        width: 160,
        height: 160,
        child: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: [rightColor1, rightColor2, Colors.transparent],
              stops: const [0.0, 0.5, 1.0],
            ),
          ),
        ),
      ),
    ];
  }

  Gradient _getBorderGradient(DayTraceThemeType type, DayTraceThemeTokens tokens) {
    switch (type) {
      case DayTraceThemeType.light:
        return const LinearGradient(colors: [Color(0xFF38BDF8), Color(0xFF818CF8), Color(0xFFC084FC), Color(0xFFF472B6), Color(0xFFFB923C), Color(0xFF34D399), Color(0xFF38BDF8)]);
      case DayTraceThemeType.dark:
        return const LinearGradient(colors: [Color(0xFF00F5A6), Color(0xFF0DD1E0), Color(0xFF6366F1), Color(0xFFB838D9), Color(0xFF00F5A6)]);
      case DayTraceThemeType.aurora:
        return const LinearGradient(colors: [Color(0xFF00E699), Color(0xFF00CBE8), Color(0xFF5D5FEF), Color(0xFFC035C8), Color(0xFF00E699)]);
    }
  }
}
