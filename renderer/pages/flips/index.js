import React from 'react'
import {FiPlusSquare} from 'react-icons/fi'
import {rem} from 'polished'
import useLocalStorage from '../../shared/hooks/use-local-storage'
import Layout from '../../components/layout'
import {Heading, Box} from '../../shared/components'
import theme from '../../shared/theme'
import FlipToolbar, {
  FlipToolbarItem,
} from '../../screens/flips/shared/components/toolbar'
import FlipList from '../../screens/flips/shared/components/flip-list'
import useFlips from '../../shared/utils/useFlips'
import Flex from '../../shared/components/flex'
import IconLink from '../../shared/components/icon-link'
import FlipCover from '../../screens/flips/shared/components/flip-cover'
import FlipType from '../../screens/flips/shared/types/flip-type'
import {useNotificationDispatch} from '../../shared/providers/notification-context'

function Flips() {
  const {flips, submitFlip, deleteFlip} = useFlips()
  const {addNotification, addError} = useNotificationDispatch()

  const [filter, setFilter] = useLocalStorage(
    'flips/filter',
    FlipType.Published
  )

  const filteredFlips = flips.filter(({type}) => type === filter)

  return (
    <Layout>
      <Box px={theme.spacings.xxxlarge} py={theme.spacings.large}>
        <Heading>My Flips</Heading>
        <FlipToolbar>
          <Flex>
            {Object.values(FlipType).map(type => (
              <FlipToolbarItem
                key={type}
                onClick={() => {
                  setFilter(type)
                }}
                isCurrent={filter === type}
              >
                {type}
              </FlipToolbarItem>
            ))}
          </Flex>
          <Flex>
            <IconLink href="/flips/new" icon={<FiPlusSquare />}>
              Add flip
            </IconLink>
          </Flex>
        </FlipToolbar>
      </Box>
      <Box my={rem(theme.spacings.medium32)} px={theme.spacings.xxxlarge}>
        <FlipList>
          {filteredFlips.map(flip => (
            <FlipCover
              key={flip.id}
              {...flip}
              width="25%"
              onSubmit={async () => {
                try {
                  const {result, error} = await submitFlip(flip)
                  if (error) {
                    addError({
                      title: 'Error while uploading flip',
                      body: error.message,
                    })
                  } else {
                    addNotification({
                      title: 'Flip saved',
                      body: result.hash,
                    })
                  }
                } catch (error) {
                  let message = 'Something went wrong'
                  if (error.response && error.response.status === 413) {
                    message = 'Maximum image size exceeded'
                  }
                  addError({
                    title: message,
                  })
                }
              }}
              onDelete={() => {
                deleteFlip(flip)
              }}
            />
          ))}
        </FlipList>
      </Box>
    </Layout>
  )
}

export default Flips
