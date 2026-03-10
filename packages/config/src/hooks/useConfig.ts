import { AllWidgetSettings, RootConfig } from '../types';
import { useConfigDispatch, useConfigState } from './useConfigContext';

export function useAppSetting<K extends keyof RootConfig['app']>(key: K) {
  const state = useConfigState();
  const dispatch = useConfigDispatch();
  return [
    state.app[key],
    (value: RootConfig['app'][K]) =>
      dispatch({
        type: 'SET_APP_SETTING',
        key: key as
          | 'useAutoTiling'
          | 'zebarWebsocketUri'
          | 'currentThemeId'
          | 'radius',
        value: value as unknown as 'useAutoTiling' extends K
          ? boolean
          : 'zebarWebsocketUri' extends K
            ? string
            : 'currentThemeId' extends K
              ? string
              : 'radius' extends K
                ? string
                : never,
      }),
  ] as const;
}

export function useWidgetSetting<
  T extends keyof AllWidgetSettings,
  K extends string,
>(widgetName: T, key: K) {
  const state = useConfigState();
  const dispatch = useConfigDispatch();

  const widgets = state.widgets as Record<string, Record<string, unknown>>;
  const value = widgets[widgetName]?.[key];

  const setValue = (value: unknown) => {
    dispatch({ type: 'SET_WIDGET_SETTING', widget: widgetName, key, value });
  };

  return [value, setValue] as const;
}
