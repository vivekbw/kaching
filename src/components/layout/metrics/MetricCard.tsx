import { Card, Text, Flex, Box } from "@radix-ui/themes";
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Skeleton, SkeletonText } from "@chakra-ui/react";
import "./MetricCard.css";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColor?: string;
  isLoading?: boolean;
}

export function MetricCard({ title, value, icon, iconColor, isLoading = false }: MetricCardProps) {
  return (
    <Card size="3" className="metric-card" style={{ width: "400px" }}>
      <Flex justify="between" align="center">
        <Box>
          {icon && (
            <Skeleton isLoaded={!isLoading} borderRadius="full">
              <Box
                className="bg-gray-50 rounded-full"
                style={{ 
                  color: iconColor,
                  padding: '1.5rem',
                }}>
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transform: 'scale(1.5)'
                }}>
                  {icon}
                </div>
              </Box>
            </Skeleton>
          )}
        </Box>
        <Flex direction="column" align="end">
          <SkeletonText isLoaded={!isLoading} noOfLines={1} skeletonHeight="4">
            <Text size="2" color="gray">
              {title}
            </Text>
          </SkeletonText>
          <Skeleton isLoaded={!isLoading} mt="2">
            <Text size="6">{value}</Text>
          </Skeleton>
        </Flex>
      </Flex>
    </Card>
  );
} 