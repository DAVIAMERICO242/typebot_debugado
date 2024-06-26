import { SessionState, SetVariableBlock, Variable } from '@typebot.io/schemas'
import { byId, isEmpty } from '@typebot.io/lib'
import { ExecuteLogicResponse } from '../../../types'
import { parseScriptToExecuteClientSideAction } from '../script/executeScript'
import { parseGuessedValueType } from '@typebot.io/variables/parseGuessedValueType'
import { parseVariables } from '@typebot.io/variables/parseVariables'
import { updateVariablesInSession } from '@typebot.io/variables/updateVariablesInSession'
import { createId } from '@paralleldrive/cuid2'
import { utcToZonedTime, format as tzFormat } from 'date-fns-tz'

export const executeSetVariable = (
  state: SessionState,
  block: SetVariableBlock
): ExecuteLogicResponse => {
  const { variables } = state.typebotsQueue[0].typebot
  if (!block.options?.variableId)
    return {
      outgoingEdgeId: block.outgoingEdgeId,
    }
  const expressionToEvaluate = getExpressionToEvaluate(state)(block.options)
  const isCustomValue = !block.options.type || block.options.type === 'Custom'
  if (
    expressionToEvaluate &&
    !state.whatsApp &&
    ((isCustomValue && block.options.isExecutedOnClient) ||
      block.options.type === 'Moment of the day')
  ) {
    const scriptToExecute = parseScriptToExecuteClientSideAction(
      variables,
      expressionToEvaluate
    )
    return {
      outgoingEdgeId: block.outgoingEdgeId,
      clientSideActions: [
        {
          type: 'setVariable',
          setVariable: {
            scriptToExecute,
          },
          expectsDedicatedReply: true,
        },
      ],
    }
  }
  const evaluatedExpression = expressionToEvaluate
    ? evaluateSetVariableExpression(variables)(expressionToEvaluate)
    : undefined
  const existingVariable = variables.find(byId(block.options.variableId))
  if (!existingVariable) return { outgoingEdgeId: block.outgoingEdgeId }
  const newVariable = {
    ...existingVariable,
    value: evaluatedExpression,
  }
  const newSessionState = updateVariablesInSession(state)([newVariable])
  return {
    outgoingEdgeId: block.outgoingEdgeId,
    newSessionState,
  }
}

const evaluateSetVariableExpression =
  (variables: Variable[]) =>
  (str: string): unknown => {
    const isSingleVariable =
      str.startsWith('{{') && str.endsWith('}}') && str.split('{{').length === 2
    if (isSingleVariable) return parseVariables(variables)(str)
    // To avoid octal number evaluation
    if (!isNaN(str as unknown as number) && /0[^.].+/.test(str)) return str
    const evaluating = parseVariables(variables, { fieldToParse: 'id' })(
      str.includes('return ') ? str : `return ${str}`
    )
    try {
      const func = Function(...variables.map((v) => v.id), evaluating)
      return func(...variables.map((v) => parseGuessedValueType(v.value)))
    } catch (err) {
      return parseVariables(variables)(str)
    }
  }

const getExpressionToEvaluate =
  (state: SessionState) =>
  (options: SetVariableBlock['options']): string | null => {
    switch (options?.type) {
      case 'Contact name': {
        console.log('DEBUGGANDO CONTACT NAME BY DA')
        console.log(state)
        return state.whatsApp?.contact.name ?? null
      }
      case 'Phone number': {
        const phoneNumber = state.whatsApp?.contact.phoneNumber.split('@')[0]
        return phoneNumber ? `"${state.whatsApp?.contact.phoneNumber.split('@')[0]}"` : null
      }
      case 'Now': {
        return '{{=new Date(new Date().getTime()).toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"});=}}'
      }
      case 'Today': {
        return '{{=new Date(new Date().getTime()).toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(",")[0];=}}'
      }
      case 'Tomorrow': {
        return '{{=new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(",")[0];=}}'
      }
      case 'Yesterday': {
        return '{{=new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(",")[0];=}}'
      }
      case 'Random ID': {
        return `"${createId()}"`
      }
      case 'Result ID':
      case 'User ID': {
        return state.typebotsQueue[0].resultId ?? `"${createId()}"`
      }
      case 'Map item with same index': {
        return `const itemIndex = ${options.mapListItemParams?.baseListVariableId}.indexOf(${options.mapListItemParams?.baseItemVariableId})
      return ${options.mapListItemParams?.targetListVariableId}.at(itemIndex)`
      }
      case 'Append value(s)': {
        return `if(!${options.item}) return ${options.variableId};
        if(!${options.variableId}) return [${options.item}];
        if(!Array.isArray(${options.variableId})) return [${options.variableId}, ${options.item}];
        return (${options.variableId}).concat(${options.item});`
      }
      case 'Empty': {
        return null
      }
      case 'Moment of the day': {
        return `const now = new Date()
        if(now.getHours() < 12) return 'morning'
        if(now.getHours() >= 12 && now.getHours() < 18) return 'afternoon'
        if(now.getHours() >= 18) return 'evening'
        if(now.getHours() >= 22 || now.getHours() < 6) return 'night'`
      }
      case 'Environment name': {
        return state.whatsApp ? 'whatsapp' : 'web'
      }
      case 'Custom':
      case undefined: {
        return options?.expressionToEvaluate ?? null
      }
    }
  }

const toISOWithTz = (date: Date, timeZone: string) => {
  const zonedDate = utcToZonedTime(date, timeZone)
  return tzFormat(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone })
}
