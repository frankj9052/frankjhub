import {
  HTTP_METHOD,
  HttpMethod,
  PermissionOptionList,
  ServiceRoute,
  serviceRouteSchema,
} from '@frankjhub/shared-schema';
import { FrankButton, GeneralTableColumn } from '@frankjhub/shared-ui-hero-ssr';
import { useMemo, useState } from 'react';
import { FrankInput, FrankSelect, SelectItemType } from '../../FormFields';
import { AddPermission } from './AddPermission';
import { FrankGeneralTable } from '../../../table';
import { generateColumnsFromKeys } from '@frankjhub/shared-utils';

const initialRoute: ServiceRoute = {
  path: '',
  methods: [],
  requiredScopes: [],
  rewrite: '',
  rateLimit: undefined,
};

export interface AddRouteProps {
  /** 受控：当前 routes 列表 */
  routes?: ServiceRoute[];
  /** 受控：变更回调（整个数组） */
  onChange: (next: ServiceRoute[]) => void;

  /** 可选：权限选项列表 */
  permissionOptionList?: PermissionOptionList;

  /** 可选：由上层校验传入的错误消息（例如 zod 要求至少 1 条 route） */
  errorMessage?: string;

  /** 可选：禁用状态 */
  isDisabled?: boolean;
}

export const AddRoute = ({
  routes = [],
  onChange,
  permissionOptionList = [],
  errorMessage,
  isDisabled,
}: AddRouteProps) => {
  const [showForm, setShowForm] = useState(false);
  const [route, setRoute] = useState<ServiceRoute>(initialRoute);
  const [localError, setLocalError] = useState<string | null>(null);
  const methodItems: SelectItemType[] = useMemo(
    () =>
      (Object.values(HTTP_METHOD) as HttpMethod[]).map(m => ({
        key: m,
        label: m,
      })),
    []
  );
  const columnKeys: (keyof ServiceRoute)[] = [
    'path',
    'methods',
    'requiredScopes',
    'rewrite',
    'rateLimit',
  ];
  const routeRecords: GeneralTableColumn[] = generateColumnsFromKeys(columnKeys, {
    extraColumns: [
      {
        name: 'Action',
        uid: 'action',
        align: 'center',
      },
    ],
  });

  const handleDeleteByIndex = (index: number) => {
    const next = routes.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleCreate = () => {
    const result = serviceRouteSchema.safeParse(route);
    const exist = routes.find(
      r => r.path === route.path && r.methods.toString() === route.methods.toString()
    );

    if (!result.success) {
      const msg = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
      setLocalError(msg);
      return;
    }
    if (exist) {
      setLocalError('Route already exist');
      return;
    }
    if (isDisabled) return;
    setLocalError(null);
    onChange([...routes, route]);
    setShowForm(false);
    setRoute(initialRoute);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Routes Record */}

      <div>
        <label className="font-semibold text-sm">Route Added:</label>
        <FrankGeneralTable
          columns={routeRecords}
          ariaLabel="route record"
          data={routes.map((r, index) => ({
            ...r,
            id: `[${r.methods.join(', ')}]:${r.path}`,
            index,
          }))}
          emptyContent={'No Route Added'}
          renderCell={(item, columnKey) => {
            const cellValue = item[columnKey as keyof typeof item];
            switch (columnKey) {
              case 'methods':
              case 'requiredScopes':
                if (typeof cellValue === 'string') {
                  return <span>cellValue</span>;
                } else if (Array.isArray(cellValue)) {
                  return <span>[{cellValue.join(', ')}]</span>;
                }
                return;
              case 'rateLimit':
                if (cellValue && typeof cellValue === 'object') {
                  const str = Object.entries(cellValue)
                    .map(([k, v]) => `${k}:${v}`)
                    .join(', ');
                  return <span>{str}</span>;
                }
                return;
              case 'action': {
                return (
                  <FrankButton
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleDeleteByIndex(item.index)}
                  >
                    Delete
                  </FrankButton>
                );
              }
              default:
                return <span>{String(cellValue)}</span>;
            }
          }}
        />
      </div>

      {/* add routes button */}
      {!showForm && (
        <div>
          <FrankButton
            color="secondary"
            size="sm"
            onPress={() => {
              setShowForm(true);
            }}
            isDisabled={isDisabled}
            variant="ghost"
          >
            Create a new route
          </FrankButton>
        </div>
      )}
      {/* route form */}
      {showForm && (
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Create a new route:</label>
          {/* path */}
          <div>
            <FrankInput
              label="path"
              isRequired={true}
              size="sm"
              variant="bordered"
              value={route.path}
              isDisabled={isDisabled}
              onValueChange={value => {
                setRoute(prev => ({
                  ...prev,
                  path: value,
                }));
              }}
            />
          </div>
          {/* Method & rewrite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <FrankSelect
                label="Methods"
                size="sm"
                variant="bordered"
                items={methodItems}
                isDisabled={isDisabled}
                selectionMode="multiple"
                selectedKeys={route.methods}
                onSelectionChange={sharedSelection => {
                  const selectionArray = Array.from(sharedSelection) as HttpMethod[];
                  setRoute(prev => ({
                    ...prev,
                    methods: selectionArray,
                  }));
                }}
              />
            </div>
            <div>
              <FrankInput
                label="rewrite"
                size="sm"
                variant="bordered"
                value={route.rewrite}
                isDisabled={isDisabled}
                onValueChange={value => {
                  setRoute(prev => ({
                    ...prev,
                    rewrite: value,
                  }));
                }}
              />
            </div>
          </div>
          {/* require scopes */}
          <AddPermission
            permissionOptionList={permissionOptionList}
            value={route.requiredScopes}
            onChange={next => setRoute(prev => ({ ...prev, requiredScopes: next }))}
            isDisabled={isDisabled}
          />
          {/* Rate Limit */}
          <div className="border-gray-200 border rounded-lg p-2 flex flex-col gap-2">
            <h3 className="text-gray-400 pl-1 text-sm">Rate Limit (Optional):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <FrankInput
                  label="WindowsMs"
                  size="sm"
                  type="number"
                  variant="bordered"
                  value={route.rateLimit?.windowMs ? String(route.rateLimit?.windowMs) : ''}
                  onValueChange={value => {
                    setRoute(prev => ({
                      ...prev,
                      rateLimit:
                        value && value.length > 0 && Number(value) > 0
                          ? {
                              windowMs: Number(value),
                              max: prev.rateLimit?.max ?? 0,
                            }
                          : undefined,
                    }));
                  }}
                />
              </div>
              <div>
                <FrankInput
                  label="Max"
                  size="sm"
                  type="number"
                  variant="bordered"
                  value={route.rateLimit?.max ? String(route.rateLimit.max) : ''}
                  isDisabled={!route.rateLimit}
                  onValueChange={value => {
                    setRoute(prev => ({
                      ...prev,
                      rateLimit:
                        prev.rateLimit && Number(prev.rateLimit.windowMs) > 0
                          ? {
                              windowMs: prev.rateLimit.windowMs,
                              max: Number(value),
                            }
                          : undefined,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex gap-4">
            <FrankButton
              variant="ghost"
              className="text-secondary"
              onPress={() => {
                setShowForm(false);
                setRoute(initialRoute);
                setLocalError(null);
              }}
              size="sm"
            >
              Cancel
            </FrankButton>
            <FrankButton variant="solid" color="secondary" size="sm" onPress={handleCreate}>
              Create Route
            </FrankButton>
          </div>
        </div>
      )}
      {/* Error message */}
      {localError && <p className="text-danger text-sm pl-1">{localError}</p>}
      {errorMessage && <p className="text-danger text-sm pl-1">{errorMessage}</p>}
    </div>
  );
};
