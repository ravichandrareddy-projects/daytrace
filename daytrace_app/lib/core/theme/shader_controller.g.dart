// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shader_controller.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(ShaderController)
final shaderControllerProvider = ShaderControllerProvider._();

final class ShaderControllerProvider
    extends $AsyncNotifierProvider<ShaderController, ShaderProgramCache> {
  ShaderControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'shaderControllerProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$shaderControllerHash();

  @$internal
  @override
  ShaderController create() => ShaderController();
}

String _$shaderControllerHash() => r'f1f96729273febdcaa6e77dfb6cc10a7931f47e0';

abstract class _$ShaderController extends $AsyncNotifier<ShaderProgramCache> {
  FutureOr<ShaderProgramCache> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref =
        this.ref as $Ref<AsyncValue<ShaderProgramCache>, ShaderProgramCache>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<ShaderProgramCache>, ShaderProgramCache>,
              AsyncValue<ShaderProgramCache>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
