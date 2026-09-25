import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/theme_provider.dart';
import 'daytrace_bottom_navigation.dart';
import 'daytrace_animated_background.dart';
import 'daytrace_ambient_border.dart';

class DayTraceAppShell extends ConsumerStatefulWidget {
  final Widget child;

  const DayTraceAppShell({super.key, required this.child});

  @override
  ConsumerState<DayTraceAppShell> createState() => _DayTraceAppShellState();
}

class _DayTraceAppShellState extends ConsumerState<DayTraceAppShell> {
  @override
  Widget build(BuildContext context) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return Scaffold(
      backgroundColor: themeTokens.background,
      body: DayTraceAnimatedBackground(
        child: Stack(
          children: [
            // The current page from GoRouter (z-10)
            widget.child,
            
            // Ambient Border and Corner Glows (z-20, z-30)
            const Positioned.fill(
              child: DayTraceAmbientBorder(),
            ),
            
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: DayTraceBottomNavigation(),
            ),
          ],
        ),
      ),
    );
  }
}
